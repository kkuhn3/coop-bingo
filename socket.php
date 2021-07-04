<?php

namespace MyApp;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class Socket implements MessageComponentInterface {

    public function __construct()
    {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $conn) {

        // Store the new connection in $this->clients
        $this->clients->attach($conn);

        echo "New connection! ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg) {
		echo "Client $from->resourceId said $msg\n";
        foreach ( $this->clients as $client ) {
            if ( $from->resourceId != $client->resourceId && $msg != "ping") {
				$client->send( "$msg" );
			}
			else if( $from->resourceId == $client->resourceId && $msg == "ping" ){
				$client->send( "pong" );
			}
        }
    }

    public function onClose(ConnectionInterface $conn) {
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
    }
}
