rm -rf static
mkdir static

cd public || exit

echo "building / ======================"
cd main || exit
ed pack

perl -i -pe 'next if /src="https/; next if /src="{{/; s/src="/src="{{CONTEXT}}\//g' index.html
perl -i -pe 'next if /src="https/; next if /src="{{/; s/src="/src="{{CONTEXT}}\//g' docs/index.html

perl -i -pe 'next if /href="https/; next if /href="{{/; s/href="/href="{{CONTEXT}}\//g' index.html
perl -i -pe 'next if /href="https/; next if /href="{{/; s/href="/href="{{CONTEXT}}\//g' docs/index.html

cp -r docs/* ../../static
rm -rf docs