//bin.hk.js
//hacks the target for money $$

/** @param {NS} ns **/
export async function main(ns) {
	let target = ns.args[0];
	let repeat = ns.args[1];
	do {
		await ns.hack(target)
	} while (repeat)
}
