Producing PDF Files:

Script Settings:
1. To run the script in print mode, open "paperLayout.js", go to line 1820, delete the "//" before "paperLayout.createPaper("print");".
Insert "//" before "paperLayout.createPaper("screen");" on Line 1821.

Browser Settings:
1. Set all print margins to 0 and scaling to 100%.

PDF-Printer Settings:
1. Set the Papersize to "A4" for LNCS Papers, use "Letter" for the other types.
2. Set the Paperorientation to "landscape mode" for chi-extended Papers, use "portrait format" for the other types.
3. Print the Paper, press "reload page" in your Browser and print again.

---------------------

Creating a new Paper:

To create a Paper, use one of the paper template files (e.g. lncs.html) as an example, the syntax is rather self-explaining. You dont have to change anything in the assosiated Stylesheet or Javascript files.
To include a BibTex-literature-file, change the fileending to ".html" and insert it as an object (see sample papers for details).
The Chi Extended Abstracts format allows fullpage images. If you want to include a fullpage image in your paper, open "paperLayout.js", go to line 149 "this.fullImgPage = yourPageNumber;" and insert the desired page number.



