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

public class CsvParser {
	
	//private Pattern numPattern = new Pattern("\\d", 0);

	private String [] csvFiles = {
			"2010-Table1.csv",
			"2011-Table1.csv",
			"2012-Table1.csv",
			"2013-Table1.csv",
			"2014-Table1.csv"
	};

	public CsvParser(){
		//process2008results();
		//process2009results();
		processOtherResults();
	}

	private void processOtherResults() {
		for(String file : csvFiles){
			String line = "";

			try {
				Scanner scanner = new Scanner(new File(file));
				try {
					Writer writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream("new" + file)));
					//Throw away header information
					scanner.nextLine();
					String header = "Round,Date,Home Team,Score,Away Team,Venue\n";
					writer.write(header);

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
							
							String homeTeam = lineScanner.next();
							String oldScore = lineScanner.next();
							String awayTeam = lineScanner.next();
							String oldVenue = lineScanner.next();
							//oldVenue = oldVenue.concat(lineScanner.next());

							//Mutation Stage
							dateOrBye = dateOrBye.matches("\\d");
							String date = dateOrBye.replace("\"", "");
							String score = oldScore.replace("–", "-");	 //–
							String venue = oldVenue.replace("\"", "");

							//Output stage
							line = String.format("%s,%s,%s,%s,%s,%s", round, date, homeTeam, score, awayTeam, venue);
						}
						System.out.println(line);
						writer.write(line + "\n");
						lineScanner.close();
					}
					writer.close();

				} catch (IOException e) {
					System.err.println("Was not able to write to file: " + e.getMessage());
				}
				scanner.close();
			}
			catch(FileNotFoundException e){
				System.err.println("" + e.getMessage());
			}
		}
	}

	private void process2009results() {
		String line = "";

		try {
			Scanner scanner = new Scanner(new File("2009-Table1.csv"));
			try {
				Writer writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream("v1-2009-Table1.csv")));
				//Throw away header information
				scanner.nextLine();
				String header = "Round,Date,Home Team,Score,Away Team,Venue\n";
				writer.write(header);

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
						String oldScore = lineScanner.next();
						String awayTeam = lineScanner.next();
						String oldVenue = lineScanner.next();
						//oldVenue = oldVenue.concat(lineScanner.next());

						//Mutation Stage
						String date = dateOrBye.replace("\"", "");
						String score = oldScore.replace("–", "-");	 //–
						String venue = oldVenue.replace("\"", "");

						//Output stage
						line = String.format("%s,%s,%s,%s,%s,%s", round, date, homeTeam, score, awayTeam, venue);
					}
					System.out.println(line);
					writer.write(line + "\n");
					lineScanner.close();
				}
				writer.close();

			} catch (IOException e) {
				System.err.println("Was not able to write to file: " + e.getMessage());
			}
			scanner.close();
		}
		catch(FileNotFoundException e){
			System.err.println("" + e.getMessage());
		}
	}

	public void process2008results(){
		String line = "";

		try {
			Scanner scanner = new Scanner(new File("2008-Table1.csv"));
			try {
				Writer writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream("v1-2008-Table1.csv")));
				//Throw away header information
				scanner.nextLine();
				String header = "Round,Date,Home Team,Score,Away Team,Venue\n";
				writer.write(header);

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
						String date = dateOrBye;
						lineScanner.next();							//skip the time, throw away
						String homeTeam = lineScanner.next();
						String oldScore = lineScanner.next();
						String awayTeam = lineScanner.next();
						String oldVenue = lineScanner.next();

						//Mutation Stage
						String score = oldScore.replace("–", "-");	 //–
						String venue = oldVenue.replace("\"", "");

						//Output stage
						line = String.format("%s,%s,%s,%s,%s,%s", round, date, homeTeam, score, awayTeam, venue);
					}
					writer.write(line + "\n");
				}
				writer.close();

			} catch (IOException e) {
				System.err.println("Was not able to write to file: " + e.getMessage());
			}
			scanner.close();
		}
		catch(FileNotFoundException e){
			System.err.println("" + e.getMessage());
		}
	}


	public static void main(String[] args) {
		CsvParser csvp = new CsvParser();
	}

}
