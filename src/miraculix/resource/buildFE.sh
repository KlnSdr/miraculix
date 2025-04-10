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

echo "building /classes ======================"
cd ../classes || exit
ed pack

perl -i -pe 'next if /src="https/; next if /src="{{/; s/src="/src="{{CONTEXT}}\/classes\//g' index.html
perl -i -pe 'next if /src="https/; next if /src="{{/; s/src="/src="{{CONTEXT}}\/classes\//g' docs/index.html

perl -i -pe 'next if /href="https/; next if /href="{{/; s/href="/href="{{CONTEXT}}\/classes\//g' index.html
perl -i -pe 'next if /href="https/; next if /href="{{/; s/href="/href="{{CONTEXT}}\/classes\//g' docs/index.html

mkdir ../../static/classes
cp -r docs/* ../../static/classes
rm -rf docs

echo "building /tests ======================"
cd ../tests || exit
ed pack

perl -i -pe 'next if /src="https/; next if /src="{{/; s/src="/src="{{CONTEXT}}\/tests\//g' index.html
perl -i -pe 'next if /src="https/; next if /src="{{/; s/src="/src="{{CONTEXT}}\/tests\//g' docs/index.html

perl -i -pe 'next if /href="https/; next if /href="{{/; s/href="/href="{{CONTEXT}}\/tests\//g' index.html
perl -i -pe 'next if /href="https/; next if /href="{{/; s/href="/href="{{CONTEXT}}\/tests\//g' docs/index.html

mkdir ../../static/tests
cp -r docs/* ../../static/tests
rm -rf docs

echo "building /tests/id/{id} ======================"
cd ../testDetails || exit
ed pack

perl -i -pe 'next if /src="https/; next if /src="{{/; s/src="/src="{{CONTEXT}}\/testDetails\//g' index.html
perl -i -pe 'next if /src="https/; next if /src="{{/; s/src="/src="{{CONTEXT}}\/testDetails\//g' docs/index.html

perl -i -pe 'next if /href="https/; next if /href="{{/; s/href="/href="{{CONTEXT}}\/testDetails\//g' index.html
perl -i -pe 'next if /href="https/; next if /href="{{/; s/href="/href="{{CONTEXT}}\/testDetails\//g' docs/index.html

mkdir ../../static/testDetails
cp -r docs/* ../../static/testDetails
rm -rf docs

echo "building /logout ======================"
cd ../logout || exit

mkdir ../../static/logout
cp -r index.html ../../static/logout
echo "done!"

echo "building /hades/login ======================"
cd ../login || exit
ed pack

perl -i -pe 'next if /src="https/; next if /src="{{/; s/src="/src="{{CONTEXT}}\/hades\/login\//g' index.html
perl -i -pe 'next if /src="https/; next if /src="{{/; s/src="/src="{{CONTEXT}}\/hades\/login\//g' docs/index.html

perl -i -pe 'next if /href="https/; next if /href="{{/; s/href="/href="{{CONTEXT}}\/hades\/login\//g' index.html
perl -i -pe 'next if /href="https/; next if /href="{{/; s/href="/href="{{CONTEXT}}\/hades\/login\//g' docs/index.html

mkdir ../../static/hades
mkdir ../../static/hades/login
cp -r docs/* ../../static/hades/login
rm -rf docs

echo "building /hades/signup ======================"
cd ../signup || exit
ed pack

perl -i -pe 'next if /src="https/; next if /src="{{/; s/src="/src="{{CONTEXT}}\/hades\/signup\//g' index.html
perl -i -pe 'next if /src="https/; next if /src="{{/; s/src="/src="{{CONTEXT}}\/hades\/signup\//g' docs/index.html

perl -i -pe 'next if /href="https/; next if /href="{{/; s/href="/href="{{CONTEXT}}\/hades\/signup\//g' index.html
perl -i -pe 'next if /href="https/; next if /href="{{/; s/href="/href="{{CONTEXT}}\/hades\/signup\//g' docs/index.html

mkdir ../../static/hades/signup
cp -r docs/* ../../static/hades/signup
rm -rf docs
