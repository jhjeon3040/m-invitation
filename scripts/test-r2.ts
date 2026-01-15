import { S3Client, ListBucketsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import "dotenv/config";

async function testR2Connection() {
  console.log("=== R2 Connection Test ===\n");

  // 환경 변수 확인
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;

  console.log("1. Environment Variables:");
  console.log(`   R2_ACCOUNT_ID: ${accountId ? `${accountId.slice(0, 8)}...` : "❌ NOT SET"}`);
  console.log(`   R2_ACCESS_KEY_ID: ${accessKeyId ? `${accessKeyId.slice(0, 8)}...` : "❌ NOT SET"}`);
  console.log(`   R2_SECRET_ACCESS_KEY: ${secretAccessKey ? "***SET***" : "❌ NOT SET"}`);
  console.log(`   R2_BUCKET_NAME: ${bucketName || "❌ NOT SET"}`);
  console.log();

  if (!accountId || !accessKeyId || !secretAccessKey) {
    console.error("❌ Missing required environment variables");
    process.exit(1);
  }

  const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;
  console.log(`2. Endpoint: ${endpoint}\n`);

  const client = new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });

  // Test 1: List Buckets
  console.log("3. Testing ListBuckets...");
  try {
    const buckets = await client.send(new ListBucketsCommand({}));
    console.log(`   ✅ Success! Found ${buckets.Buckets?.length || 0} bucket(s)`);
    buckets.Buckets?.forEach((b) => console.log(`      - ${b.Name}`));
  } catch (error) {
    console.log(`   ❌ Failed: ${error instanceof Error ? error.message : error}`);
  }
  console.log();

  // Test 2: List Objects in Bucket
  if (bucketName) {
    console.log(`4. Testing ListObjects in "${bucketName}"...`);
    try {
      const objects = await client.send(new ListObjectsV2Command({
        Bucket: bucketName,
        MaxKeys: 5,
      }));
      console.log(`   ✅ Success! Found ${objects.KeyCount || 0} object(s)`);
      objects.Contents?.slice(0, 5).forEach((o) => console.log(`      - ${o.Key}`));
    } catch (error) {
      console.log(`   ❌ Failed: ${error instanceof Error ? error.message : error}`);
    }
  }

  console.log("\n=== Test Complete ===");
}

testR2Connection().catch(console.error);
