# Follower Maze

## The Challenge
The challenge here is to build a system which acts as a socket
server, reading events from an *event source* and forwarding them when
appropriate to *user clients*.

Clients will connect through TCP and use the simple protocol described in a
section below. There will be two types of clients connecting to your server:

- **One** *event source*: It will send you a
stream of events which may or may not require clients to be notified
- **Many** *user clients*: Each one representing a specific user,
these wait for notifications for events which would be relevant to the
user they represent

### The Protocol
The protocol used by the clients is string-based (i.e. a `CRLF` control
character terminates each message). All strings are encoded in `UTF-8`.

The *event souce* **connects on port 9090** and will start sending
events as soon as the connection is accepted.

The many *user clients* will **connect on port 9099**. As soon
as the connection is accepted, they will send to the server the ID of
the represented user, so that the server knows which events to
inform them of. For example, once connected a *user client* may send down:
`2932\r\n`, indicating that they are representing user 2932.

After the identification is sent, the *user client* starts waiting for
events to be sent to them. Events coming from *event source* should be
sent to relevant *user clients* exactly like read, no modification is
required or allowed.

### The Events
There are five possible events. The table below describe payloads
sent by the *event source* and what they represent:

| Payload                   | Seq #  | Type         | From User Id | To User Id |
|---------------------------|--------|--------------|--------------|------------|
|666&#124;F&#124;60&#124;50 | 666    | Follow       | 60           | 50         |
|1&#124;U&#124;12&#124;9    | 1      | Unfollow     | 12           | 9          |
|542532&#124;B              | 542532 | Broadcast    | -            | -          |
|43&#124;P&#124;32&#124;56  | 43     | Private Msg  | 32           | 56         |
|634&#124;S&#124;32         | 634    | Status Update| 32           | -          |

Using the [verification program](#verification-program), you will receive exactly X events,
with sequence number from 1 to X. **The events will arrive out of order**.

Events may generate notifications for *user clients*. **If there is a
*user client* ** connected for them, these are the users to be
informed for different event types:

* **Follow**: Only the `To User Id` should be notified
* **Unfollow**: No clients should be notified
* **Broadcast**: All connected *user clients* should be notified
* **Private Message**: Only the `To User Id` should be notified
* **Status Update**: All current followers of the `From User ID` should be notified

If there are no *user client* connected for a user, any notifications
for them must be silently ignored. *user clients* expect to be notified of
events **in the correct order**, regardless of the order in which the
*event source* sent them.

### <a name='verification-program'> Verification Program </a>

To run the clients, first make sure you have the server you wrote
running and listening to ports 9090 and 9099, then run:

```
$ ./bin/challenge.sh
```

This will start the clients, which will immediately start sending
message to your server. You know it finished without errors when it
outputs:

```
 [INFO] ==================================
 [INFO] \o/ ALL NOTIFICATIONS RECEIVED \o/
 [INFO] ==================================
```