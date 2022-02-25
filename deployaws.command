dir="/Users/sonapetrosyan/projects/ws"


aws s3 cp $dir s3://wordsearchapp/   --recursive  --exclude "*" --include "*.js"  --acl "public-read"
aws s3 cp  $dir  s3://wordsearchapp/   --recursive  --exclude "*" --include "*.html"  --acl "public-read"
aws s3 cp  $dir  s3://wordsearchapp/   --recursive  --exclude "*" --include "*.css"  --acl "public-read"
aws s3 cp  $dir/images  s3://wordsearchapp/images   --recursive  --acl "public-read"
aws s3 cp $dir/res  s3://wordsearchapp/res   --recursive  --acl "public-read"