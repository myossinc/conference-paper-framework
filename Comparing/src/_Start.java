import java.io.IOException;
import java.util.ArrayList;

import org.apache.pdfbox.util.TextPosition;

public class _Start {

	// Relative paths to the pdf files to be compared
	private static final String FILE_1 = "samples/LatexEA.pdf";
	private static final String FILE_2 = "samples/WordEA.pdf";
	private static final String SEARCH_THIS_TERM = "First";

	public static void main(String[] args) {
		compareVisually();
		mineDataFromPdf();
	}

	// Create a new pdf file that shows both files under test overlapping
	private static void compareVisually() {
		Diffpdf diffpdf = new Diffpdf();
		try {
			diffpdf.compare(FILE_1, FILE_2);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	// Find x- and y-coordinates of a term in the pdf file and formatting
	private static void mineDataFromPdf() {
		Pdfbox box = new Pdfbox();
		ArrayList<TextPosition> list_file1, list_file2;
		try {
			// Find occurrences of the search term in both files
			list_file1 = box.findPositions(FILE_1, 0, SEARCH_THIS_TERM);
			list_file2 = box.findPositions(FILE_2, 0, SEARCH_THIS_TERM);
			
			// Write results to a text file
			String formattedResults = box.formatPdfboxResults(FILE_1, FILE_2, SEARCH_THIS_TERM, list_file1, list_file2);
			box.createContentFile(formattedResults);
		} catch (IOException e) {
			e.printStackTrace();
		}

	}
}
