import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

try {
    const result = await dns.promises.resolveSrv(
        "_mongodb._tcp.cluster0.obxclcp.mongodb.net"
    );

    console.log(result);
} catch (error) {
    console.error(error);
}