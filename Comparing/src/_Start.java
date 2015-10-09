import java.io.IOException;
import java.util.ArrayList;

import org.apache.pdfbox.util.TextPosition;

public class _Start {

	public static void main(String[] args) {
		compareVisually();
		mineDataFromPdf();
		createPseudoHtml();
	}

	// Create a new pdf file that shows both files under test overlapping
	private static void compareVisually() {
		Diffpdf diffpdf = new Diffpdf();
		try {
			diffpdf.compare(Const.FILE_1, Const.FILE_2);
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
			list_file1 = box.findPositions(Const.FILE_1, 0, Const.SEARCH_THIS_TERM);
			list_file2 = box.findPositions(Const.FILE_2, 0, Const.SEARCH_THIS_TERM);

			
			// Write results to a text file
			String formattedResults = box.formatPdfboxResults(Const.FILE_1, Const.FILE_2, Const.SEARCH_THIS_TERM, list_file1, list_file2);
			box.createContentFile(formattedResults);
		} catch (IOException e) {
			e.printStackTrace();
		}

	}

	private static void createPseudoHtml() {
		Pdfminer miner = new Pdfminer();
		miner.createHtml(Const.FILE_2);
		miner.loadHtml();
		miner.processHtml();
	}
}
