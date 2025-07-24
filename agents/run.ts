#!/usr/bin/env ts-node

import gppAgent from './gpp-agent.agent';

async function main() {
  console.log('🚀 Starting GPP Agent Runner...');
  
  try {
    const startTime = Date.now();
    
    const result = await gppAgent.run();
    
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);
    
    console.log('\n🎉 Agent execution completed!');
    console.log(`⏱️ Total duration: ${duration}s`);
    console.log('📊 Results:', result);
    
    process.exit(0);
  } catch (error) {
    console.error('💥 Agent execution failed:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// Run the agent
main().catch(error => {
  console.error('💥 Unhandled error:', error);
  process.exit(1);
}); 