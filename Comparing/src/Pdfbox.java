import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;

import org.apache.pdfbox.cos.COSDocument;
import org.apache.pdfbox.pdfparser.PDFParser;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.util.PDFTextStripper;
import org.apache.pdfbox.util.TextPosition;

public class Pdfbox {

	public Pdfbox() {
	}

	public void extractText(String path) {
		PDFTextStripper pdfStripper = null;
		PDDocument pdDoc = null;
		COSDocument cosDoc = null;
		File file = new File(path);
		try {
			PDFParser parser = new PDFParser(new FileInputStream(file));
			parser.parse();
			cosDoc = parser.getDocument();
			pdfStripper = new PDFTextStripper();
			pdDoc = new PDDocument(cosDoc);

			pdfStripper.setStartPage(pdfStripper.getStartPage());
			pdfStripper.setEndPage(pdfStripper.getEndPage());
			String parsedText = pdfStripper.getText(pdDoc);

			createContentFile(parsedText);

		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void createContentFile(String content) {
		PrintWriter writer;
		try {
			writer = new PrintWriter(Const.SAVE_PDFBOX, "UTF-8");
			writer.println(content);
			writer.close();
		} catch (FileNotFoundException | UnsupportedEncodingException e) {
			e.printStackTrace();
		}
	}

	/**
	 * Find positions of 'key' in the pdf file on a given page
	 *
	 * @param pdfFile
	 *            the pdf file
	 * @param pageNum
	 *            the page number
	 * @param key
	 *            the term to look for
	 * @return ArrayList containing all occurrences of the term saved as
	 *         TextPosition
	 * @throws IOException
	 *             Signals that an I/O exception has occurred.
	 */
	public ArrayList findPositions(String pdfFile, int pageNum, final String key) throws IOException {
		PDDocument document = PDDocument.load(pdfFile);
		final StringBuffer extractedText = new StringBuffer();
		final ArrayList<TextPosition> positions = new ArrayList<TextPosition>();
		PDFTextStripper textStripper = new PDFTextStripper() {
			@Override
			protected void processTextPosition(TextPosition text) {
				extractedText.append(text.getCharacter());
				if (extractedText.toString().endsWith(key)) {
					positions.add(text);
				}
			}
		};
		PDPage page = (PDPage) document.getDocumentCatalog().getAllPages().get(pageNum);
		textStripper.processStream(page, page.findResources(), page.getContents().getStream());
		return positions;
	}

	/**
	 * Format pdfbox results.
	 *
	 * @param file1
	 *            First pdf
	 * @param file2
	 *            Second pdf
	 * @param term
	 *            Term to be searched within the pdfs
	 * @param list1
	 *            All occurrences of 'term' in file1
	 * @param list2
	 *            All occurrences of 'term' in file2
	 * @return Formatted String of Pdfbox results
	 */
	public String formatPdfboxResults(String file1, String file2, String term, ArrayList<TextPosition> list1,
			ArrayList<TextPosition> list2) {
		ArrayList<String> content = new ArrayList<String>();
		TextPosition item1 = list1.get(0), item2 = list2.get(0);
		double x1 = round(item1.getX()), x2 = round(item2.getX()), y1 = round(item1.getY()), y2 = round(item2.getY()),
				height1 = round(item1.getHeight()), height2 = round(item2.getHeight()),
				width1 = round(item1.getWidth()), width2 = round(item2.getWidth()),
				space1 = round(item1.getWidthOfSpace()), space2 = round(item2.getWidthOfSpace());
		String font1 = item1.getFont().getBaseFont().substring(7, item1.getFont().getBaseFont().length()),
				font2 = item2.getFont().getBaseFont().substring(7, item2.getFont().getBaseFont().length());

		// Files being compared
		content.add("File 1:\t" + file1 + Const.LB + "File 2:\t" + file2 + Const.DLB);

		// Term position (x- and y-coordinates)
		content.add("Position of term '" + term + "'" + Const.LB + "\tFile 1:\t\tx =\t" + x1 + "\t| y = " + y1
				+ Const.LB + "\tFile 2:\t\tx =\t" + x2 + "\t| y = " + y2 + Const.LB + "\tDelta:\t\tx =\t" + diff(x1, x2)
				+ "\t| y = " + diff(y1, y2) + Const.DLB);

		// Term height
		content.add("Height of term '" + term + "'" + Const.LB + "\tFile 1:\t\t" + height1 + Const.LB + "\tFile 2:\t\t"
				+ height2 + Const.LB + "\tDelta:\t\t" + diff(height1, height2) + Const.DLB);

		// Term width
		content.add("Width of term '" + term + "'" + Const.LB + "\tFile 1:\t\t" + width1 + Const.LB + "\tFile 2:\t\t"
				+ width2 + Const.LB + "\tDelta:\t\t" + diff(width1, width2) + Const.DLB);

		// Space character width
		content.add("Width of space character" + Const.LB + "\tFile 1:\t\t" + space1 + Const.LB + "\tFile 2:\t\t"
				+ space2 + Const.LB + "\tDelta:\t\t" + diff(space1, space2) + Const.DLB);

		// Font
		content.add("Font used" + Const.LB + "\tFile 1:\t" + font1 + Const.LB + "\tFile 2:\t" + font2 + Const.DLB);

		String result = "";
		for (int i = 0; i < content.size(); i++) {
			result += content.get(i);
		}

		return result;
	}

	// Return the distance of two double values
	private static double diff(double x, double y) {
		double result = x - y;
		result = round(result);
		return result >= 0 ? result : result * (-1);
	}

	// Round a double value to 3 decimals
	private static double round(double d) {
		return Math.round(d * 100.0) / 100.0;
	}

}
