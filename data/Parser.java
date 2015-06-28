import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.Scanner;

/**
 * A parser to process files that were given out in the SWEN303 d3.js assignment.
 * Converts csv files into a format that is uniform between files, and easier to process.
 *
 * @author Pauline Kelly
 */
public class Parser {
	
	private String total = "var newData = [";

	private FileAndYear[] csvFiles = {
			new FileAndYear("2008-Table1.csv", 2008),
			new FileAndYear("2009-Table1.csv", 2009),
			new FileAndYear("2010-Table1.csv", 2010),
			new FileAndYear("2011-Table1.csv", 2011),
			new FileAndYear("2012-Table1.csv", 2012),
			new FileAndYear("2013-Table1.csv", 2013),
			new FileAndYear("2014-Table1.csv", 2014)
	};

	/**
	 * Constructor
	 */
	public Parser(){
		processResults();
	}

	/**
	 * Process the results depending on the year
	 */
	public void processResults(){
		for(FileAndYear fy : csvFiles){
			try {
				Scanner scanner = new Scanner(new File(fy.filename));

				//Throw away header information
				scanner.nextLine();
				String header = "round,day,dayNumber,month,homeTeam,homeTeamScore,awayTeamScore,awayTeam,venue\n";

                total += String.format("{\"year\": %d,\n \"data\": [", fy.year);
				if(fy.year == 2008){
					parse2008(header, scanner);
				}
				else if(fy.year == 2009) {
					parse2009(header, scanner);
				}
				else {
					parseOther(header, scanner);
				}
				scanner.close();
			}
			catch(FileNotFoundException e){
				System.out.println(fy.filename + " not present.");
			}
		}

		Writer writer;
		try {
			writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream("convertedData.js")));
			total = total.substring(0,  total.length()-3);
			total = total + "}];";
			writer.write(total);
			writer.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	/**
	 * Parse 2008 file, different format than the others
	 * @param scanner
	 * @param writer
	 */
	private void parse2008(String header, Scanner scanner) {
		String line = "";
		while(scanner.hasNextLine()){
			line = scanner.nextLine();
			Scanner lineScanner = new Scanner(line);
			lineScanner.useDelimiter(",");

			String round = lineScanner.next();
			String dateOrBye = lineScanner.next();
			if(dateOrBye.startsWith("BYES:")){
				String [] teams = dateOrBye.split(" and ");
				String teamA = teams[0];
				String teamB = teams[1];
				String newTeamA = teamA.replace("BYES: ","");
				line = String.format("%s,%s,%s,%s,%s,%s,%s,%s,%s",round,"BYE","null"," ",newTeamA,"null","null",teamB," ");
				line = formatAsJSON(header, line);

			}
			else {
				lineScanner.next(); //skip the time, throw away
				String homeTeam = lineScanner.next();
				String oldScore = lineScanner.next();
				//System.out.println("preScore " + oldScore);
				String awayTeam = lineScanner.next();
				String oldVenue = lineScanner.next();
				//String city = lineScanner.next();  //can't do city! too hard to extract from strings

				//Mutation Stage
				//Dates
				String [] dateInfo = dateOrBye.split(" ");
				String day = dateInfo[0];
				String dayNumber = dateInfo[1];
				String month = dateInfo[2];
				//Scores
				String[] score = oldScore.split("â€“|-|–");
				String homeScore = score[0];
				String awayScore = score[1];
				String venue = oldVenue.replace("\"", "");
				//Output stage
				line = String.format("%s,%s,%s,%s,%s,%s,%s,%s,%s", round, day, dayNumber, month, homeTeam, homeScore, awayScore, awayTeam, venue);

				line = formatAsJSON(header, line);
			}
			line = line.concat(",");
			System.out.println(line);
			total = total + line;
		}
		//try {
			total = total.substring(0, total.length()-1);
			total = total + "]},\n";
			//writer.write(total);
		//} catch (IOException e) {
		//	e.printStackTrace();
		//}
	}

	private String formatAsJSON(String header, String line) {
		String newString = "";
		header = header.replace("\n", "");
		line = line.replace("\n", "");
		String [] newHeader = header.split(",");
		String [] newLine = line.split(",");

		newString = newString.concat("{\n");
		for(int i = 0; i < newHeader.length; ++i){
			newString = newString.concat("\t\"" + newHeader[i] + "\":\"" + newLine[i] + "\"");
			if(i == newHeader.length-1){
			}
			else {
				newString = newString.concat(",\n");
			}
		}
		newString = newString.concat("\n}");
		//go back and overwrite that last comma

		return newString;
	}

	/**
	 * Parse the 2009 games. The date is in a different format to the others.
	 * @param scanner
	 * @param writer
	 */
	private void parse2009(String header, Scanner scanner) {
		String line = "";
		while(scanner.hasNextLine()){
			line = scanner.nextLine();
			Scanner lineScanner = new Scanner(line);
			lineScanner.useDelimiter(",");

			String round = lineScanner.next();

			String dateOrBye = lineScanner.next();

			if(dateOrBye.startsWith("BYES: ")){
				String [] teams = dateOrBye.split(" and ");
				String teamA = teams[0];
				String teamB = teams[1];
				String newTeamA = teamA.replace("BYES: ", "");
				line = String.format("%s,%s,%s,%s,%s,%s,%s,%s,%s",round,"BYE","null"," ",newTeamA,"null","null",teamB," ");
				line = formatAsJSON(header, line);

			}
			else {
				lineScanner.next();
				String homeTeam = lineScanner.next();
				String oldScore = lineScanner.next();
				String awayTeam = lineScanner.next();
				String oldVenue = lineScanner.next();
				
				if (oldScore.contains("\"")){
					oldScore = oldScore.split(" ")[0];
					oldScore = oldScore.substring(1, oldScore.length());
				}

				//Mutation Stage
				//Dates
				String [] dateInfo = dateOrBye.split(" ");
				String day = dateInfo[0].replace("\"", "");;
				String dayNumber = dateInfo[1];
				String month = dateInfo[2];
				//Scores
				String[] score = oldScore.split("â€“|-|–");
				String homeScore = score[0];
				String awayScore = score[1];
				String venue = oldVenue.replace("\"", "");

				//Output stage
				line = String.format("%s,%s,%s,%s,%s,%s,%s,%s,%s", round, day, dayNumber, month, homeTeam, homeScore, awayScore, awayTeam, venue);
				line = formatAsJSON(header, line);
				
				total = total + line + ",";
			}
		}
		//try {
			total = total.substring(0, total.length()-1);
			total = total + "]},\n";
		//	writer.write(total);
		//} catch (IOException e) {
		//	e.printStackTrace();
		//	throw new RuntimeException("Couldn't print the line");
		//}
	}


	/**
	 * Parses all other files, as they conform to the same format.
	 * @param scanner
	 * @param writer
	 */
	private void parseOther(String header, Scanner scanner) {
		String line = "";
		while(scanner.hasNextLine()){
			line = scanner.nextLine();
			Scanner lineScanner = new Scanner(line);
			lineScanner.useDelimiter(",");

			String round = lineScanner.next();
			System.out.println("round:" + round);

			String dateOrBye = lineScanner.next();
			//System.out.println("date:" + dateOrBye);

			if(dateOrBye.startsWith("BYES: ")){
				String [] teams = dateOrBye.split(" and ");
				String teamA = teams[0];
				String teamB = teams[1];
				String newTeamA = teamA.replace("BYES: ", "");
				line = String.format("%s,%s,%s,%s,%s,%s,%s,%s,%s",round,"BYE","null"," ",newTeamA,"null","null",teamB," ");
				line = formatAsJSON(header, line);
			}
			else {
				String homeTeam = lineScanner.next();
				String oldScore = lineScanner.next();
				String awayTeam = lineScanner.next();
				String oldVenue = lineScanner.next();
				//oldVenue = oldVenue.concat(lineScanner.next());

				//Mutation Stage
				String date = dateOrBye.replace("\"", "");
				String [] dateInfo = dateOrBye.split(" ");
				String day = dateInfo[0];
				day = day.replace("\"", "");
				String dayNumber = dateInfo[1];
				String month = dateInfo[2];
				//Scores
				oldScore = oldScore.replace(" ", "");
				String[] score = oldScore.split("â€“|-|–");
				String homeScore = score[0];
				String awayScore = score[1];
				String venue = oldVenue.replace("\"", "");
				//Output stage
				line = String.format("%s,%s,%s,%s,%s,%s,%s,%s,%s", round, day, dayNumber, month, homeTeam, homeScore, awayScore, awayTeam, venue);
				line = formatAsJSON(header, line);
				total = total + line + ",";
			}
		}
		//try {
			total = total.substring(0, total.length()-1);
			total = total + "]},\n";
		//	writer.write(total);
		//} catch (IOException e) {
		//	e.printStackTrace();
		//	throw new RuntimeException("Couldn't print the line");
		//}
	}

	/**
	 * Main
	 * @param args
	 */
	public static void main(String[] args) {
		new Parser();
	}


    private class FileAndYear {
        protected String filename;
        protected int year;

        public FileAndYear(String fn, int y) {
            this.filename = fn;
            this.year = y;
        }
    }
}
