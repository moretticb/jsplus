@echo off
echo +-------------------------------------+
echo ^|                                     ^|
echo ^|  JS Plus - Documentation generator  ^|
echo ^|                                     ^|
echo +-------------------------------------+
echo.

echo Parsing comments, generating HTML pages and index XML file...
C:\php\php.exe parse.php > docsIndex.xml

echo.
echo Done. Press RETURN to proceed
PAUSE

echo.
echo.
echo Moving generated documentation to docs website folder...
move docsIndex.xml ..\docs
move output\* ..\docs\pages

echo.
echo Done. Finished successfully.

PAUSE