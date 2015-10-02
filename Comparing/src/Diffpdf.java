import java.io.IOException;

public class Diffpdf {

	public Diffpdf() {
		System.out.println("Diffpdf:\tInitialized");
	}

	// Creates a new pdf file that shows the visual differences between two pdfs
	public void compare(String command) throws IOException {
		try {
			Process p = Runtime.getRuntime().exec(command);
			p.waitFor();
		} catch (IOException e1) {
			e1.printStackTrace();
		} catch (InterruptedException e2) {
			e2.printStackTrace();
		}
	}
}