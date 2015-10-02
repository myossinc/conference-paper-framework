import java.io.IOException;
import java.util.ArrayList;

import org.apache.pdfbox.util.TextPosition;

public class _Start {

	// Relative paths to the pdf files to be compared
	private static final String FILE_1 = "samples/LatexEA.pdf";
	private static final String FILE_2 = "samples/WordEA.pdf";

	// Variables Diffpdf
	private static final String PATH_DIFFPDF = "lib/diff-pdf/";
	private static final String SCRIPT_DIFFPDF = "diff-pdf" + " ";
	private static final String COMMAND_DIFFPDF = "--output-diff=results/Result_Diffpdf.pdf " + FILE_1 + " " + FILE_2;

	// Keywords
	private static final String SEARCH_THIS_TERM = "First";

	public static void main(String[] args) {
		compareVisually();
		mineDataFromPdf();
	}

	// Create a new pdf file that shows both files under test overlapping
	private static void compareVisually() {
		Diffpdf diffpdf = new Diffpdf();
		try {
			diffpdf.compare(PATH_DIFFPDF + SCRIPT_DIFFPDF + COMMAND_DIFFPDF);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	// Find x- and y-coordinates of a term in the pdf file
	private static void mineDataFromPdf() {
		Pdfbox box = new Pdfbox();
		ArrayList<TextPosition> list;		
		try {
			list = box.findPositions(FILE_1, 0, SEARCH_THIS_TERM);			
			box.createContentFile(createPdfboxContentString(list));
		} catch (IOException e) {
			e.printStackTrace();
		}

	}
	
	private static String createPdfboxContentString(ArrayList<TextPosition> list) {
		ArrayList<String> content = new ArrayList<String>();
		content.add("Position of '" + SEARCH_THIS_TERM +"' in " + FILE_1 + ":\n");
		content.add("x = " + list.get(0).getX() +  ", y = " + list.get(0).getY());
		String result = "";
		
		for (int i = 0; i < content.size(); i++) {
			result += content.get(i);
		}
		
		return result;
	}

}
