//This script is aloha2.js
//Run this script after crack.js opens all servers
//This script will target all servers with avalible ram and avalible money (ignoring servers that do not have money and no ram)
//It will dynamically use all the ram of the infected server to weaken/grow/hack the server
//these must be on the home server to work my bin.wk.js, bin.hk.js, bin.gr.js. 

// Constants
const WEAKEN_RAM = 1.75;
const HACK_RAM = 1.75;
const GROW_RAM = 1.7;
const SLEEP_TIME = 10;

// Scan and return an array of servers dynamically
function scanServers(ns, current = "home", set = new Set()) {
    let connections = ns.scan(current);
    let next = connections.filter(c => !set.has(c));
    next.forEach(n => {
        set.add(n);
        return scanServers(ns, n, set);
    });
    return Array.from(set);
}

// Calculate available threads based on free RAM
function calculateThreads(ns, hostname, scriptRam) {
    let freeRam = ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname);
    return Math.floor(freeRam / scriptRam);
}

// Main function
export async function main(ns) {
    // Scan servers with available money and free RAM
    let servers = scanServers(ns).filter(server =>
        ns.getServerMoneyAvailable(server) > 0 &&
        ns.getServerMaxRam(server) - ns.getServerUsedRam(server) > 0
    );

    // Copy required scripts to servers with available money and free RAM
    for (let server of servers) {
        await ns.scp(["bin.wk.js", "bin.hk.js", "bin.gr.js"], server, "home");
    }

    // Main loop
    while (true) {
        for (let server of servers) {
            // Skip the home server
            if (server === "home") continue;

            let targets = [server]; // Only target the current server

            for (let target of targets) {
                if (ns.hasRootAccess(server) && ns.hasRootAccess(target)) {
                    if (ns.getServerSecurityLevel(target) === ns.getServerMinSecurityLevel(target) && ns.getServerMoneyAvailable(target) === ns.getServerMaxMoney(target)) {
                        let availableThreads = calculateThreads(ns, server, HACK_RAM);
                        if (availableThreads >= 1) {
                            ns.exec("bin.hk.js", server, availableThreads, target);
                        }
                    } else if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)) {
                        let availableThreads = calculateThreads(ns, server, WEAKEN_RAM);
                        if (availableThreads >= 1) {
                            ns.exec("bin.wk.js", server, availableThreads, target);
                        }
                    } else {
                        let availableThreads = calculateThreads(ns, server, GROW_RAM);
                        if (availableThreads >= 1) {
                            ns.exec("bin.gr.js", server, availableThreads, target);
                        }
                    }
                }
            }
        }

        await ns.sleep(SLEEP_TIME);
    }
}
