dir="/Users/sonapetrosyan/projects/ws/public"
output="public" 

Mkdir -p $output
Mkdir -p $output/content
Mkdir -p $output/images
Mkdir -p $output/images/coloring
Mkdir -p $output/res
Mkdir -p $output/script
Mkdir -p $output/script/lib

cp $dir/*.js $output 
cp $dir/*.html $output
cp $dir/*.ico $output

cp $dir/content/*  $output/content
cp $dir/script/* $output/script
cp $dir/script/lib/* $output/script/lib
cp $dir/images/* $output/images
cp $dir/images/coloring/* $output/images/coloring
cp $dir/res/* $output/res

firebase deploy