import java.awt.List;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.pdfbox.cos.COSArray;
import org.apache.pdfbox.cos.COSDictionary;
import org.apache.pdfbox.cos.COSDocument;
import org.apache.pdfbox.cos.COSName;
import org.apache.pdfbox.pdfparser.PDFParser;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.interactive.form.PDField;
import org.apache.pdfbox.util.PDFTextStripper;
import org.apache.pdfbox.util.TextPosition;

public class Pdfbox {

	public Pdfbox() {
		System.out.println("Pdfbox:\t\tInitialized");
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

	private void createContentFile(String content) {
		PrintWriter writer;
		try {
			writer = new PrintWriter("results/Result_Pdfbox.txt", "UTF-8");
			writer.println(content);
			writer.close();
		} catch (FileNotFoundException | UnsupportedEncodingException e) {
			e.printStackTrace();
		}
	}

	public PDRectangle getFieldArea(PDField field) {
		COSDictionary fieldDict = field.getDictionary();
		COSArray fieldAreaArray = (COSArray) fieldDict.getDictionaryObject(COSName.RECT);
		PDRectangle result = new PDRectangle(fieldAreaArray);
		return result;
	}

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

}
