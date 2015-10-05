import java.io.IOException;

public class Diffpdf {
	
	private static final String PATH_DIFFPDF = "lib/diff-pdf/";
	private static final String SCRIPT_DIFFPDF = "diff-pdf" + " ";
	private static final String COMMAND_DIFFPDF = "--output-diff=results/Result_Diffpdf.pdf ";

	public Diffpdf() {
		System.out.println("Diffpdf:\tInitialized");
	}

	// Creates a new pdf file that shows the visual differences between two pdfs
	public void compare(String file1, String file2) throws IOException {
		try {
			Process p = Runtime.getRuntime().exec(PATH_DIFFPDF + SCRIPT_DIFFPDF + COMMAND_DIFFPDF + file1 + " " + file2);
			p.waitFor();
		} catch (IOException e1) {
			e1.printStackTrace();
		} catch (InterruptedException e2) {
			e2.printStackTrace();
		}
	}
}