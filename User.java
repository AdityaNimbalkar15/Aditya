package Sbi;


import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Scanner;

public class User {
	private Scanner scanner;
	private Connection connection;

	public User(Scanner scanner, Connection connection) {
		this.scanner = scanner;
		this.connection=connection;
	}
	public void register() {
		scanner.nextLine();
		System.out.println("Full Name: ");
		String Full_Name = scanner.nextLine();
		System.out.println("Email: ");
		String email = scanner.nextLine(); 
		System.out.println("Password: ");
		String password = scanner.nextLine();
		if(user_exist(email)) {
			System.out.println("User already exists for these email adress!!!");
			return;
		}
		String query = "INSERT INTO user(Full_Name,Email,Password) VALUES(?,?,?)";
		try {
			PreparedStatement preparedstatement = connection.prepareStatement(query);
			preparedstatement.setString(1,Full_Name  );
			preparedstatement.setString(2,email  );
			preparedstatement.setString(3,password);
			int affectRows = preparedstatement.executeUpdate();
			if(affectRows > 0) {
				System.out.println("Registration Successfull !!!");
				
			}
			else {
				System.out.println("Registration Failed !!!");
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
	}
	private boolean user_exist(String email) {
		String user_query = "SELECT * FROM user WHERE Email=?";
		try {
			PreparedStatement preparedstatement = connection.prepareStatement(user_query);
			preparedstatement.setString(1,email  );
			ResultSet resultset = preparedstatement.executeQuery();
			if(resultset.next()) {
				return true;
			}
			else {
				return false;
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
		return false;
	}
	public String login() {
		scanner.nextLine();
		System.out.println("Email: ");
		String email = scanner.nextLine(); 
		System.out.println("Password: ");
		String password = scanner.nextLine();
		String login_query = "SELECT * FROM User Where Email = ? AND Password=?"; // from database Email and Password
		try {
			PreparedStatement preparedstatement = connection.prepareStatement(login_query);
			preparedstatement.setString(1,email  );
			preparedstatement.setString(2,password);
			ResultSet resultset = preparedstatement.executeQuery();
			if(resultset.next()){
				
				return email;
			}
			else {
				return null;
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return null;
		
	}

}
