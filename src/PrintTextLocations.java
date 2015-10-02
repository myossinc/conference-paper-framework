import java.io.IOException;
import java.util.List;

import org.apache.pdfbox.exceptions.InvalidPasswordException;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.common.PDStream;
import org.apache.pdfbox.util.PDFTextStripper;
import org.apache.pdfbox.util.TextPosition;

public class PrintTextLocations extends PDFTextStripper {

	private static PDDocument doc;
	
	public PrintTextLocations(PDDocument doc) throws IOException {
		super.setSortByPosition(true);
		this.doc = doc;
	}

	public static void main(String[] args) throws Exception {
		if (doc != null) {
			usage();
		} else {
			PDDocument document = doc;
			try {
				if (document.isEncrypted()) {
					document.decrypt("");
				}
				PrintTextLocations printer = new PrintTextLocations(doc);
				List allPages = document.getDocumentCatalog().getAllPages();
				for (int i = 0; i < allPages.size(); i++) {
					PDPage page = (PDPage) allPages.get(i);
					System.out.println("Processing page: " + i);
					PDStream contents = page.getContents();
					if (contents != null) {
						printer.processStream(page, page.findResources(), page.getContents().getStream());
					}
				}
			} finally {
				if (document != null) {
					document.close();
				}
			}
		}
	}

	protected void processTextPosition(TextPosition text) {
		System.out.println("String[" + text.getXDirAdj() + "," + text.getYDirAdj() + " fs=" + text.getFontSize()
				+ " xscale=" + text.getXScale() + " height=" + text.getHeightDir() + " space=" + text.getWidthOfSpace()
				+ " width=" + text.getWidthDirAdj() + "]" + text.getCharacter());
	}

	private static void usage() {
		System.err.println("Usage: java org.apache.pdfbox.examples.pdmodel.PrintTextLocations <input-pdf>");
	}

}