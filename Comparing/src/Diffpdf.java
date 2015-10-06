import java.io.IOException;

public class Diffpdf {

	public Diffpdf() {
	}

	// Creates a new pdf file that shows the visual differences between two pdfs
	public void compare(String file1, String file2) throws IOException {
		try {
			Process p = Runtime.getRuntime().exec(Const.COMMAND_DIFFPDF + file1 + " " + file2);
			p.waitFor();
		} catch (IOException e1) {
			e1.printStackTrace();
		} catch (InterruptedException e2) {
			e2.printStackTrace();
		}
	}
}