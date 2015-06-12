import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.Scanner;
import java.util.regex.Pattern;

/**
 * A parser to process files that were given out in the SWEN303 d3.js assignment. 
 * Converts csv files into a format that is uniform between files, and easier to process.
 * 
 * @author Pauline Kelly
 */
public class Parser {

	private String [] csvFiles = {
			"2008-Table1.csv",
			"2009-Table1.csv",
			"2010-Table1.csv",
			"2011-Table1.csv",
			"2012-Table1.csv",
			"2013-Table1.csv",
			"2014-Table1.csv"
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
		for(String file : csvFiles){
			try {
				Scanner scanner = new Scanner(new File(file));

				//Write to the file depending on the specifics of the file
				try {
					Writer writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream("converted"+file)));

					//Throw away header information
					scanner.nextLine();
					String header = "Round,Date,HomeTeam,HomeTeamScore,AwayTeamScore,AwayTeam,Venue\n";
					writer.write(header);

					if(file.contains("2008")){
						parse2008(scanner, writer);
					}
					else if(file.contains("2009")){
						parse2009(scanner, writer);
						System.out.println("finished 2009");
					}
					else {
						parseOther(scanner,writer);
						System.out.println("finished" + file);
					}
					System.out.println("wrote to file");
					writer.close();

				} catch (IOException e) {
					System.err.println("Was not able to write to file: " + e.getMessage());
				}
				scanner.close();
			}
			catch(FileNotFoundException e){
				if(e.getMessage().startsWith("2014")){
					System.out.println("2014 not present.");
					return;
				}
				else {
					System.err.println("" + e.getMessage());
				}
			}
		}
	}

	/**
	 * Parse 2008 file, different format than the others
	 * @param scanner
	 * @param writer
	 */
	private void parse2008(Scanner scanner, Writer writer) {
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
				line = String.format("BYE,%s,%s,%s",round, newTeamA, teamB);
			}
			else {
				lineScanner.next();							//skip the time, throw away
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
				String[] score = oldScore.split("â€“|-");	
				
				String homeScore = score[0];
				String awayScore = score[1];
								
				String venue = oldVenue.replace("\"", "");
				
				//Output stage
				line = String.format("%s,%s,%s,%s,%s,%s,%s,%s,%s", round, day, dayNumber, month, homeTeam, homeScore, awayScore, awayTeam, venue);
			}
			try {
				writer.write(line + "\n");
			} catch (IOException e) {
				e.printStackTrace();
				throw new RuntimeException("Couldn't print the line");
			}
		}
	}

	/**
	 * Parse the 2009 games. The date is in a different format to the others.
	 * @param scanner
	 * @param writer
	 */
	private void parse2009(Scanner scanner, Writer writer) {
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
				line = String.format("BYE,%s,%s,%s",round, newTeamA, teamB);
			}
			else {
				lineScanner.next();	//throw away time
				String homeTeam = lineScanner.next();
				//System.out.println("Hometeam: " + homeTeam);
				String oldScore = lineScanner.next();
				String awayTeam = lineScanner.next();
				String oldVenue = lineScanner.next();
				//oldVenue = oldVenue.concat(lineScanner.next());

				//Mutation Stage
				//Dates				
				String [] dateInfo = dateOrBye.split(" ");
				String day = dateInfo[0].replace("\"", "");;
				String dayNumber = dateInfo[1];
				String month = dateInfo[2];
				
				//Scores
				//System.out.println("Round: " + round + ", Oldscore " + oldScore);
				String[] score = oldScore.split("â€“|-");	
				
				String homeScore = score[0];
				String awayScore = score[1];
				
				String venue = oldVenue.replace("\"", "");

				//Output stage
				line = String.format("%s,%s,%s,%s,%s,%s,%s,%s,%s", round, day, dayNumber, month, homeTeam, homeScore, awayScore, awayTeam, venue);
			}
			try {
				writer.write(line + "\n");
			} catch (IOException e) {
				e.printStackTrace();
				throw new RuntimeException("Couldn't print the line");
			}
		}
	}


	/**
	 * Parses all other files, as they conform to the same format.
	 * @param scanner
	 * @param writer
	 */
	private void parseOther(Scanner scanner, Writer writer) {
		String line = "";
		while(scanner.hasNextLine()){	
			line = scanner.nextLine();
			Scanner lineScanner = new Scanner(line);
			lineScanner.useDelimiter(",");

			String round = lineScanner.next();
			//System.out.println("round:" + round);

			String dateOrBye = lineScanner.next();
			System.out.println("date:" + dateOrBye);

			
			if(dateOrBye.startsWith("BYES: ")){
				String [] teams = dateOrBye.split(" and ");
				String teamA = teams[0];
				String teamB = teams[1];
				String newTeamA = teamA.replace("BYES: ", "");
				line = String.format("BYE,%s,%s,%s",round, newTeamA, teamB);
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
				String dayNumber = dateInfo[1];
				String month = dateInfo[2];
				
				//Scores
				oldScore = oldScore.replace(" ", "");
				String[] score = oldScore.split("â€“|-");	
				
				String homeScore = score[0];
				String awayScore = score[1];
				
				String venue = oldVenue.replace("\"", "");

				//Output stage
				line = String.format("%s,%s,%s,%s,%s,%s,%s,%s,%s", round, day, dayNumber, month, homeTeam, homeScore, awayScore, awayTeam, venue);
				System.out.println(line);
			}
			try {
				writer.write(line + "\n");
			} catch (IOException e) {
				e.printStackTrace();
				throw new RuntimeException("Couldn't print the line");
			}
		}
	}

	/**
	 * Main
	 * @param args
	 */
	public static void main(String[] args) {
		new Parser();
	}

}
