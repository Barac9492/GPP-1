const Redis = require('redis');
const winston = require('winston');

class KnowledgeGraph {
  constructor(options = {}) {
    this.redis = Redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ filename: 'logs/knowledge-graph.log' }),
        new winston.transports.Console()
      ]
    });
    
    this.nodeTypes = {
      PRODUCT: 'product',
      USER: 'user',
      MARKET: 'market',
      RETAILER: 'retailer',
      CATEGORY: 'category',
      TREND: 'trend',
      INSIGHT: 'insight'
    };
    
    this.relationshipTypes = {
      CHEAPER_THAN: 'cheaper_than',
      MORE_EXPENSIVE_THAN: 'more_expensive_than',
      INTERESTED_IN: 'interested_in',
      PURCHASED: 'purchased',
      SIMILAR_TO: 'similar_to',
      AVAILABLE_IN: 'available_in',
      TRENDING_IN: 'trending_in',
      RECOMMENDED_FOR: 'recommended_for'
    };
  }

  // Create a node in the knowledge graph
  async createNode(nodeType, nodeId, properties = {}) {
    const node = {
      id: nodeId,
      type: nodeType,
      properties: {
        ...properties,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      }
    };
    
    const key = `node:${nodeType}:${nodeId}`;
    
    try {
      await this.redis.set(key, JSON.stringify(node));
      this.logger.info(`Created node: ${nodeType}:${nodeId}`);
      return node;
    } catch (error) {
      this.logger.error('Error creating node:', error);
      throw error;
    }
  }

  // Create a relationship between nodes
  async createRelationship(sourceType, sourceId, relationshipType, targetType, targetId, properties = {}) {
    const relationship = {
      id: `${sourceType}:${sourceId}:${relationshipType}:${targetType}:${targetId}`,
      sourceType,
      sourceId,
      relationshipType,
      targetType,
      targetId,
      properties: {
        ...properties,
        strength: properties.strength || 1.0,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      }
    };
    
    const key = `relationship:${relationship.id}`;
    
    try {
      await this.redis.set(key, JSON.stringify(relationship));
      
      // Store bidirectional index for efficient querying
      await this.redis.sadd(`outgoing:${sourceType}:${sourceId}`, relationship.id);
      await this.redis.sadd(`incoming:${targetType}:${targetId}`, relationship.id);
      
      this.logger.info(`Created relationship: ${relationship.id}`);
      return relationship;
    } catch (error) {
      this.logger.error('Error creating relationship:', error);
      throw error;
    }
  }

  // Get a node by ID
  async getNode(nodeType, nodeId) {
    const key = `node:${nodeType}:${nodeId}`;
    
    try {
      const nodeData = await this.redis.get(key);
      return nodeData ? JSON.parse(nodeData) : null;
    } catch (error) {
      this.logger.error('Error getting node:', error);
      return null;
    }
  }

  // Get relationships for a node
  async getRelationships(nodeType, nodeId, direction = 'both', relationshipType = null) {
    const relationships = [];
    
    try {
      if (direction === 'outgoing' || direction === 'both') {
        const outgoingIds = await this.redis.smembers(`outgoing:${nodeType}:${nodeId}`);
        for (const relId of outgoingIds) {
          const relationship = await this.getRelationship(relId);
          if (relationship && (!relationshipType || relationship.relationshipType === relationshipType)) {
            relationships.push(relationship);
          }
        }
      }
      
      if (direction === 'incoming' || direction === 'both') {
        const incomingIds = await this.redis.smembers(`incoming:${nodeType}:${nodeId}`);
        for (const relId of incomingIds) {
          const relationship = await this.getRelationship(relId);
          if (relationship && (!relationshipType || relationship.relationshipType === relationshipType)) {
            relationships.push(relationship);
          }
        }
      }
      
      return relationships;
    } catch (error) {
      this.logger.error('Error getting relationships:', error);
      return [];
    }
  }

  // Get a specific relationship
  async getRelationship(relationshipId) {
    const key = `relationship:${relationshipId}`;
    
    try {
      const relationshipData = await this.redis.get(key);
      return relationshipData ? JSON.parse(relationshipData) : null;
    } catch (error) {
      this.logger.error('Error getting relationship:', error);
      return null;
    }
  }

  // Find connected nodes (Obsidian-style backlinks)
  async findConnectedNodes(nodeType, nodeId, depth = 2, maxResults = 50) {
    const visited = new Set();
    const queue = [{ nodeType, nodeId, depth: 0 }];
    const connectedNodes = [];
    
    while (queue.length > 0 && connectedNodes.length < maxResults) {
      const { nodeType: currentType, nodeId: currentId, depth: currentDepth } = queue.shift();
      const nodeKey = `${currentType}:${currentId}`;
      
      if (visited.has(nodeKey) || currentDepth > depth) {
        continue;
      }
      
      visited.add(nodeKey);
      
      // Get the current node
      const node = await this.getNode(currentType, currentId);
      if (node) {
        connectedNodes.push({ ...node, depth: currentDepth });
      }
      
      // Get relationships and add connected nodes to queue
      const relationships = await this.getRelationships(currentType, currentId, 'both');
      
      for (const rel of relationships) {
        const targetKey = `${rel.targetType}:${rel.targetId}`;
        if (!visited.has(targetKey)) {
          queue.push({
            nodeType: rel.targetType,
            nodeId: rel.targetId,
            depth: currentDepth + 1
          });
        }
      }
    }
    
    return connectedNodes;
  }

  // Find paths between two nodes (Obsidian-style graph view)
  async findPaths(sourceType, sourceId, targetType, targetId, maxPaths = 5) {
    const paths = [];
    const queue = [[{ nodeType: sourceType, nodeId: sourceId }]];
    const visited = new Set();
    
    while (queue.length > 0 && paths.length < maxPaths) {
      const currentPath = queue.shift();
      const currentNode = currentPath[currentPath.length - 1];
      const nodeKey = `${currentNode.nodeType}:${currentNode.nodeId}`;
      
      if (visited.has(nodeKey)) {
        continue;
      }
      
      visited.add(nodeKey);
      
      // Check if we've reached the target
      if (currentNode.nodeType === targetType && currentNode.nodeId === targetId) {
        paths.push(currentPath);
        continue;
      }
      
      // Get relationships and explore further
      const relationships = await this.getRelationships(currentNode.nodeType, currentNode.nodeId, 'outgoing');
      
      for (const rel of relationships) {
        const nextNode = { nodeType: rel.targetType, nodeId: rel.targetId };
        const nextPath = [...currentPath, nextNode];
        queue.push(nextPath);
      }
    }
    
    return paths;
  }

  // Palantir-style intelligence: Analyze patterns and generate insights
  async analyzePatterns(nodeType, nodeId, analysisType = 'comprehensive') {
    const patterns = {};
    
    try {
      switch (analysisType) {
        case 'price_patterns':
          patterns.priceAnalysis = await this.analyzePricePatterns(nodeType, nodeId);
          break;
        case 'user_behavior':
          patterns.userBehavior = await this.analyzeUserBehavior(nodeType, nodeId);
          break;
        case 'market_trends':
          patterns.marketTrends = await this.analyzeMarketTrends(nodeType, nodeId);
          break;
        case 'comprehensive':
          patterns.priceAnalysis = await this.analyzePricePatterns(nodeType, nodeId);
          patterns.userBehavior = await this.analyzeUserBehavior(nodeType, nodeId);
          patterns.marketTrends = await this.analyzeMarketTrends(nodeType, nodeId);
          patterns.recommendations = await this.generateRecommendations(nodeType, nodeId);
          break;
      }
      
      return patterns;
    } catch (error) {
      this.logger.error('Error analyzing patterns:', error);
      return {};
    }
  }

  // Analyze price patterns for a product
  async analyzePricePatterns(nodeType, nodeId) {
    if (nodeType !== this.nodeTypes.PRODUCT) {
      return null;
    }
    
    const relationships = await this.getRelationships(nodeType, nodeId, 'both');
    const priceRelationships = relationships.filter(rel => 
      rel.relationshipType === this.relationshipTypes.CHEAPER_THAN ||
      rel.relationshipType === this.relationshipTypes.MORE_EXPENSIVE_THAN
    );
    
    const analysis = {
      priceRange: { min: Infinity, max: -Infinity },
      averagePrice: 0,
      priceVariations: [],
      bestDeals: [],
      marketComparison: {}
    };
    
    for (const rel of priceRelationships) {
      const targetNode = await this.getNode(rel.targetType, rel.targetId);
      if (targetNode && targetNode.properties.price) {
        const price = targetNode.properties.price;
        
        analysis.priceRange.min = Math.min(analysis.priceRange.min, price);
        analysis.priceRange.max = Math.max(analysis.priceRange.max, price);
        analysis.priceVariations.push({
          market: rel.targetType === this.nodeTypes.MARKET ? rel.targetId : 'unknown',
          price,
          relationship: rel.relationshipType
        });
      }
    }
    
    if (analysis.priceVariations.length > 0) {
      analysis.averagePrice = analysis.priceVariations.reduce((sum, v) => sum + v.price, 0) / analysis.priceVariations.length;
      analysis.bestDeals = analysis.priceVariations
        .filter(v => v.relationship === this.relationshipTypes.CHEAPER_THAN)
        .sort((a, b) => a.price - b.price)
        .slice(0, 5);
    }
    
    return analysis;
  }

  // Analyze user behavior patterns
  async analyzeUserBehavior(nodeType, nodeId) {
    if (nodeType !== this.nodeTypes.USER) {
      return null;
    }
    
    const relationships = await this.getRelationships(nodeType, nodeId, 'outgoing');
    const interestRelationships = relationships.filter(rel => 
      rel.relationshipType === this.relationshipTypes.INTERESTED_IN
    );
    
    const analysis = {
      interests: [],
      purchaseHistory: [],
      searchPatterns: [],
      recommendations: []
    };
    
    for (const rel of interestRelationships) {
      const targetNode = await this.getNode(rel.targetType, rel.targetId);
      if (targetNode) {
        analysis.interests.push({
          category: targetNode.properties.category,
          strength: rel.properties.strength,
          lastInteraction: rel.properties.lastUpdated
        });
      }
    }
    
    // Sort interests by strength
    analysis.interests.sort((a, b) => b.strength - a.strength);
    
    return analysis;
  }

  // Analyze market trends
  async analyzeMarketTrends(nodeType, nodeId) {
    if (nodeType !== this.nodeTypes.MARKET) {
      return null;
    }
    
    const relationships = await this.getRelationships(nodeType, nodeId, 'incoming');
    const trendingRelationships = relationships.filter(rel => 
      rel.relationshipType === this.relationshipTypes.TRENDING_IN
    );
    
    const analysis = {
      trendingProducts: [],
      priceMovements: [],
      marketInsights: []
    };
    
    for (const rel of trendingRelationships) {
      const sourceNode = await this.getNode(rel.sourceType, rel.sourceId);
      if (sourceNode) {
        analysis.trendingProducts.push({
          product: sourceNode,
          trendStrength: rel.properties.strength,
          trendDirection: rel.properties.trendDirection || 'stable'
        });
      }
    }
    
    return analysis;
  }

  // Generate recommendations based on patterns
  async generateRecommendations(nodeType, nodeId) {
    const connectedNodes = await this.findConnectedNodes(nodeType, nodeId, 2, 100);
    const recommendations = [];
    
    // Find similar users and their preferences
    if (nodeType === this.nodeTypes.USER) {
      const similarUsers = connectedNodes.filter(node => 
        node.type === this.nodeTypes.USER && node.id !== nodeId
      );
      
      for (const similarUser of similarUsers) {
        const userBehavior = await this.analyzeUserBehavior(this.nodeTypes.USER, similarUser.id);
        if (userBehavior && userBehavior.interests.length > 0) {
          recommendations.push({
            type: 'similar_user_preference',
            source: similarUser.id,
            products: userBehavior.interests.slice(0, 3)
          });
        }
      }
    }
    
    // Find trending products in user's markets
    const userMarkets = connectedNodes.filter(node => node.type === this.nodeTypes.MARKET);
    for (const market of userMarkets) {
      const marketTrends = await this.analyzeMarketTrends(this.nodeTypes.MARKET, market.id);
      if (marketTrends && marketTrends.trendingProducts.length > 0) {
        recommendations.push({
          type: 'trending_in_market',
          market: market.id,
          products: marketTrends.trendingProducts.slice(0, 3)
        });
      }
    }
    
    return recommendations;
  }

  // Update relationship strength based on user interactions
  async updateRelationshipStrength(relationshipId, newStrength, interactionType = 'view') {
    const relationship = await this.getRelationship(relationshipId);
    if (!relationship) {
      return null;
    }
    
    // Adjust strength based on interaction type
    let strengthAdjustment = 0;
    switch (interactionType) {
      case 'view':
        strengthAdjustment = 0.1;
        break;
      case 'click':
        strengthAdjustment = 0.3;
        break;
      case 'purchase':
        strengthAdjustment = 1.0;
        break;
      case 'share':
        strengthAdjustment = 0.5;
        break;
    }
    
    relationship.properties.strength = Math.min(10.0, relationship.properties.strength + strengthAdjustment);
    relationship.properties.lastUpdated = new Date().toISOString();
    relationship.properties.lastInteraction = interactionType;
    
    // Update the relationship
    const key = `relationship:${relationshipId}`;
    await this.redis.set(key, JSON.stringify(relationship));
    
    return relationship;
  }

  // Search the knowledge graph (Obsidian-style search)
  async searchGraph(query, nodeTypes = null, maxResults = 50) {
    const results = [];
    
    try {
      // Search through all nodes
      const nodePattern = nodeTypes ? 
        nodeTypes.map(type => `node:${type}:*`) : 
        ['node:*:*'];
      
      for (const pattern of nodePattern) {
        const keys = await this.redis.keys(pattern);
        
        for (const key of keys) {
          const nodeData = await this.redis.get(key);
          if (nodeData) {
            const node = JSON.parse(nodeData);
            
            // Simple text search in node properties
            const searchText = JSON.stringify(node.properties).toLowerCase();
            if (searchText.includes(query.toLowerCase())) {
              results.push({
                ...node,
                relevanceScore: this.calculateSearchRelevance(node, query)
              });
            }
          }
        }
      }
      
      // Sort by relevance and limit results
      return results
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, maxResults);
        
    } catch (error) {
      this.logger.error('Error searching graph:', error);
      return [];
    }
  }

  // Calculate search relevance score
  calculateSearchRelevance(node, query) {
    let score = 0;
    const queryLower = query.toLowerCase();
    
    // Exact matches get higher scores
    if (node.id.toLowerCase().includes(queryLower)) {
      score += 10;
    }
    
    // Property matches
    for (const [key, value] of Object.entries(node.properties)) {
      if (typeof value === 'string' && value.toLowerCase().includes(queryLower)) {
        score += 5;
      }
    }
    
    // Recency bonus
    if (node.properties.lastUpdated) {
      const daysSinceUpdate = (Date.now() - new Date(node.properties.lastUpdated).getTime()) / (1000 * 60 * 60 * 24);
      score += Math.max(0, 5 - daysSinceUpdate);
    }
    
    return score;
  }

  // Get graph statistics
  async getGraphStats() {
    try {
      const stats = {
        totalNodes: 0,
        totalRelationships: 0,
        nodesByType: {},
        relationshipsByType: {}
      };
      
      // Count nodes by type
      const nodeKeys = await this.redis.keys('node:*:*');
      for (const key of nodeKeys) {
        const nodeType = key.split(':')[1];
        stats.totalNodes++;
        stats.nodesByType[nodeType] = (stats.nodesByType[nodeType] || 0) + 1;
      }
      
      // Count relationships by type
      const relationshipKeys = await this.redis.keys('relationship:*');
      for (const key of relationshipKeys) {
        const relationshipData = await this.redis.get(key);
        if (relationshipData) {
          const relationship = JSON.parse(relationshipData);
          stats.totalRelationships++;
          stats.relationshipsByType[relationship.relationshipType] = 
            (stats.relationshipsByType[relationship.relationshipType] || 0) + 1;
        }
      }
      
      return stats;
    } catch (error) {
      this.logger.error('Error getting graph stats:', error);
      return {};
    }
  }

  // Clean up old data
  async cleanupOldData(daysOld = 30) {
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
    let cleanedCount = 0;
    
    try {
      // Clean up old nodes
      const nodeKeys = await this.redis.keys('node:*:*');
      for (const key of nodeKeys) {
        const nodeData = await this.redis.get(key);
        if (nodeData) {
          const node = JSON.parse(nodeData);
          if (new Date(node.properties.lastUpdated) < cutoffDate) {
            await this.redis.del(key);
            cleanedCount++;
          }
        }
      }
      
      // Clean up old relationships
      const relationshipKeys = await this.redis.keys('relationship:*');
      for (const key of relationshipKeys) {
        const relationshipData = await this.redis.get(key);
        if (relationshipData) {
          const relationship = JSON.parse(relationshipData);
          if (new Date(relationship.properties.lastUpdated) < cutoffDate) {
            await this.redis.del(key);
            cleanedCount++;
          }
        }
      }
      
      this.logger.info(`Cleaned up ${cleanedCount} old items`);
      return cleanedCount;
    } catch (error) {
      this.logger.error('Error cleaning up old data:', error);
      return 0;
    }
  }

  async close() {
    await this.redis.quit();
  }
}

module.exports = KnowledgeGraph; 