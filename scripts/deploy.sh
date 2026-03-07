#!/bin/bash
# Builds and deploys the widget to S3/CloudFront CDN.
#
# Usage: ./scripts/deploy.sh
#
# After upload, invalidates the CloudFront cache so changes go live immediately.

set -euo pipefail

S3_BUCKET="frostdates-cdn"
S3_PATH="widget/v1"
CF_DISTRIBUTION_ID="E2UMA96ALMCHAS"

echo "Building widget..."
npm run build

echo "Uploading to S3..."
aws s3 cp dist/frostdates-widget.iife.js \
  "s3://${S3_BUCKET}/${S3_PATH}/frostdates-widget.iife.js" \
  --content-type "application/javascript" \
  --cache-control "public, max-age=3600, s-maxage=86400"

echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id "$CF_DISTRIBUTION_ID" \
  --paths "/${S3_PATH}/*" \
  --query "Invalidation.Id" \
  --output text

echo "Done. Widget deployed to https://cdn.frostdates.com/${S3_PATH}/frostdates-widget.iife.js"
