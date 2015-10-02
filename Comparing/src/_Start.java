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
		ArrayList<TextPosition> list_file1, list_file2;
		try {
			list_file1 = box.findPositions(FILE_1, 0, SEARCH_THIS_TERM);
			list_file2 = box.findPositions(FILE_2, 0, SEARCH_THIS_TERM);
			box.createContentFile(createPdfboxContentString(list_file1, list_file2));
		} catch (IOException e) {
			e.printStackTrace();
		}

	}

	// Create a txt file that lists the results of the Pdfbox library (positions and difference of positions)
	private static String createPdfboxContentString(ArrayList<TextPosition> list1, ArrayList<TextPosition> list2) {
		ArrayList<String> content = new ArrayList<String>();
		float x1 = list1.get(0).getX(), x2 = list2.get(0).getX(), y1 = list1.get(0).getY(), y2 = list2.get(0).getY();

		content.add("Position of term '" + SEARCH_THIS_TERM + "' in " + FILE_1 + ":\n");
		content.add("x = " + x1 + ", y = " + y1 + "\n\n");
		content.add("Position of term '" + SEARCH_THIS_TERM + "' in " + FILE_2 + ":\n");
		content.add("x = " + x2 + ", y = " + y2 + "\n\n");
		content.add("Position Differences:\n");
		content.add("deltaX = " + diff(x1, x2) + ", deltaY = " + diff(y1, y2));
		String result = "";

		for (int i = 0; i < content.size(); i++) {
			result += content.get(i);
		}

		return result;
	}

	// Return the distance of two float values
	private static float diff(float x, float y) {
		float result = x - y;
		return result >= 0 ? result : result * (-1);
	}

}
