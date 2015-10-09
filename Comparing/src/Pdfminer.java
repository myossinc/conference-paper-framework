import java.io.File;
import java.io.IOException;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class Pdfminer {
	Document html;
	Element headline;

	public Pdfminer() {
	}

	public void createHtml(String file) {
		try {
			Process p = Runtime.getRuntime().exec(Const.PYTHON + Const.PDFMINER + Const.SAVE_PDFMINER + file);
		} catch (IOException e) {
			System.out.println("Creating html failed");
			e.printStackTrace();
		}
	}

	public void loadHtml() {

		File f = new File(Const.SAVE_PDFMINER);

		try {
			this.html = Jsoup.parse(f, "UTF-8", "");
		} catch (IOException e) {
			System.out.println("Loading html failed");
			e.printStackTrace();
		}
	}

	public void processHtml() {
		getHeadlineData();
	}

	// Analyze headline data
	public void getHeadlineData() {
		Elements title = this.html.select("div span");
		for (int i = 0; i < title.size(); i++) {
			if (title.get(i).html().startsWith("SIGCHI")) {

				String position, top, left, width, height, fontData, font, fontSize;

				// Print headline and its style attribute
				System.out.println("Headline: " + title.get(i).html());
				System.out.println("CSS styles: " + title.get(i).parentNode().attr("style"));

				// Find the position of the headline
				position = title.get(i).parentNode().attr("style");
				top = position.substring(position.indexOf(Const.TOP) + Const.TOP.length() + 1,
						position.indexOf(Const.SEPERATOR, position.indexOf(Const.TOP)));
				left = position.substring(position.indexOf(Const.LEFT) + Const.LEFT.length() + 1,
						position.indexOf(Const.SEPERATOR, position.indexOf(Const.LEFT)));
				width = position.substring(position.indexOf(Const.WIDTH) + Const.WIDTH.length() + 1,
						position.indexOf(Const.SEPERATOR, position.indexOf(Const.WIDTH)));
				height = position.substring(position.indexOf(Const.HEIGHT) + Const.HEIGHT.length() + 1,
						position.indexOf(Const.SEPERATOR, position.indexOf(Const.HEIGHT)));

				// Find out measurements of the headline
				fontData = title.get(i).attr("style");
				font = fontData.substring(fontData.indexOf(Const.FONTFAMILY) + Const.FONTFAMILY.length() + 9,
						fontData.indexOf(Const.SEPERATOR, fontData.indexOf(Const.FONTFAMILY)));
				fontSize = fontData.substring(fontData.indexOf(Const.FONTSIZE) + Const.FONTSIZE.length() + 1,
						fontData.indexOf("x", fontData.indexOf(Const.FONTSIZE)) + 1);

				// Print results to console
				System.out.println("top:\t" + top);
				System.out.println("left:\t" + left);
				System.out.println("width:\t" + width);
				System.out.println("height:\t" + height);
				System.out.println("font:\t" + font);
				System.out.println("font size:\t" + fontSize);
				return;
			}
		}
	}
}
