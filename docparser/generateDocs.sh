#!/bin/sh
# PHP 5.x.x must be installed to properly generate the XML file

echo "+-------------------------------------+"
echo "|                                     |"
echo "|  JS Plus - Documentation generator  |"
echo "|                                     |"
echo -e "+-------------------------------------+\n"


echo "Creating output folder..."
mkdir -p output

echo "Parsing comments, generating HTML pages and index XML file..."
php parse.php 1>docsIndex.xml 2>/dev/null

if [ $? != 0 ]; then
	echo "Error on generating documentation"
	exit 1;
fi

read -p "Done. Press RETURN to proceed..."
echo -e "\n"

echo "Moving generated documentation to docs website folder..."
mv docsIndex.xml ../docs
mv output/* ../docs/pages

if [ $? != 0 ]; then
	echo "Error on generating documentation"
	exit 1;
fi

echo "Done. Finished successfully."

