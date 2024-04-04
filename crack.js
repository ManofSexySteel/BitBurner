//This is my crack.js 
//This script is to be used to automate cracking a server and nukeing it to gain root access
//reccomend to buy all programs through the darkweb first

function dpList(ns, current = "home", set = new Set()) {
	let connections = ns.scan(current);
	let next = connections.filter(c => !set.has(c));
	next.forEach(n => {
		set.add(n);
		return dpList(ns, n, set);
	});
	return Array.from(set.keys());
}

export async function main(ns) {
	let servers = dpList(ns);

	while (true) {
		for (let server of servers) {
			// Attempt various hacking actions on each server
			try {
				ns.brutessh(server);
				ns.ftpcrack(server);
				ns.relaysmtp(server);
				ns.httpworm(server);
				ns.sqlinject(server);
			} catch (err) {
				// Handle errors, if any
				ns.tprint(`Error while hacking ${server}: ${err}`);
			}

			// Attempt to add a backdoor to the server
			try {
				ns.nuke(server, "--backdoor");
			} catch (err) {
				// Handle errors, if any
				ns.tprint(`Error while adding backdoor to ${server}: ${err}`);
			}
		}

		// Sleep for 10 seconds before the next iteration
		await ns.sleep(10);
	}
}
