public class Const {

	// Relative paths
	static final String FILE_1 = "samples/LatexProceedings.pdf";
	static final String FILE_2 = "samples/WordProceedings.pdf";
	
	// Locations of the results
	static final String SAVE_PDFBOX = "results/Result_Pdfbox.txt";
	static final String SAVE_DIFFPDF = "results/Result_Diffpdf.pdf";
	static final String SAVE_PDFMINER = "results/Result_Pdfminer.html ";
	
	// DiffPDF
	static final String COMMAND_DIFFPDF = "lib/diff-pdf/diff-pdf --output-diff=" + SAVE_DIFFPDF + " ";
	
	// PDFMiner
	static final String PYTHON = "C:/Python27/python.exe ";
	static final String PDFMINER = "lib/pdfminer/tools/pdf2txt.py -o ";
	
	// PDFBox

	// Other
	static final String LB = "\n";
	static final String DLB = "\n\n";
	static final String SEARCH_THIS_TERM = "SIGCHI";
	
	static final String LEFT = "left";
	static final String TOP = "top";
	static final String WIDTH = "width";
	static final String HEIGHT = "height";
	static final String SEPERATOR = ";";
	
	static final String FONTFAMILY = "font-family";
	static final String FONTSIZE = "font-size";
}
