// src/test-turso.ts
// Run: npx tsx src/test-turso.ts

import { tursoDb } from './lib/turso';

async function testTurso() {
  console.log('='.repeat(50));
  console.log('🧪 TURSO DATABASE TEST');
  console.log('='.repeat(50));
  
  // Test data
  const testUserId = 'test-user-123';
  const testData = {
    words: [
      {
        id: 'w1',
        word: 'Test Word',
        meaning: 'Test meaning',
        example: 'Test example',
        folderId: null,
        tags: ['test'],
        difficulty: 'Good',
        level: 'B1',
        source: 'Test',
        createdAt: new Date().toISOString().split('T')[0],
        due: new Date().toISOString().split('T')[0],
        stage: 0,
        history: []
      }
    ],
    folders: [],
    links: [],
    activityTypes: [],
    logs: [],
    blocks: [],
    settings: {
      schedule: [1, 2, 4, 7, 14, 30],
      dropdowns: {
        difficulty: ['Again', 'Hard', 'Good', 'Easy'],
        level: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        source: ['Book', 'Movie', 'YouTube', 'University'],
        linkTypes: ['related to', 'similar meaning']
      },
      reminder: {
        time: '20:00',
        onDue: true,
        threshold: 10,
        onIdle: true
      }
    }
  };
  
  console.log('\n📝 Test 1: Saving data...');
  const saveResult = await tursoDb.save(testUserId, testData);
  console.log(`   Result: ${saveResult.success ? '✅ SUCCESS' : '❌ FAILED'}`);
  
  console.log('\n📂 Test 2: Loading data...');
  const loadResult = await tursoDb.load(testUserId);
  if (loadResult.success && loadResult.data) {
    console.log(`   ✅ SUCCESS - Data loaded`);
    console.log(`   Words: ${loadResult.data.words?.length || 0}`);
    console.log(`   Folders: ${loadResult.data.folders?.length || 0}`);
  } else {
    console.log(`   ❌ FAILED: ${loadResult.error}`);
  }
  
  console.log('\n🔍 Test 3: Checking if user exists...');
  const existsResult = await tursoDb.userExists(testUserId);
  console.log(`   User exists: ${existsResult.exists ? '✅ YES' : '❌ NO'}`);
  
  console.log('\n📊 Test 4: Getting all users...');
  const usersResult = await tursoDb.getAllUsers();
  if (usersResult.success) {
    console.log(`   Total users: ${usersResult.rows?.length || 0}`);
    if (usersResult.rows && usersResult.rows.length > 0) {
      console.log(`   Users: ${usersResult.rows.map((r: any) => r.user_id).join(', ')}`);
    }
  }
  
  console.log('\n🗑️ Test 5: Deleting test data...');
  const deleteResult = await tursoDb.delete(testUserId);
  console.log(`   Result: ${deleteResult.success ? '✅ SUCCESS' : '❌ FAILED'}`);
  
  console.log('\n' + '='.repeat(50));
  console.log('✨ TEST COMPLETE!');
  console.log('='.repeat(50));
}

// Run the test
testTurso().catch(console.error);