package com.company;


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.HashMap;
import java.util.HashSet;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Main {

    public final HashMap<Integer, HashSet<Integer>> follows;
    public final HashMap<Integer, Job> jobs;
    public final HashMap<Integer, Client> connectedClients;
    public int orderedJobCounter;
    public final ExecutorService pool;
    public final ExecutorService event;

    public Main() {

        connectedClients = new HashMap<>();
        jobs = new HashMap<>();
        follows = new HashMap<>();
        pool = Executors.newCachedThreadPool();
        event = Executors.newSingleThreadExecutor();
        orderedJobCounter = 1;
        EventHandlerThread et = new EventHandlerThread();
        et.start();
        ClientHandlerThread ct = new ClientHandlerThread();
        ct.start();
        JobHandlerThread jt = new JobHandlerThread();
        jt.start();

    }

    public class Client {

        private int cid;
        private Socket socket;

        public Client(int id, Socket s) {
            cid = id;
            socket = s;
        }

        public int getCid() {
            return cid;
        }

        public Socket getSocket() {
            return socket;
        }
    }

    public class Job {

        private String ogCmd;
        private int id;
        private JobType jobType;
        private int fromUserId;
        private int toUserId;

        public Job(int jobId, JobType jbt, int fuid, int tuid, String cmd) {
            id = jobId;
            jobType = jbt;
            fromUserId = fuid;
            toUserId = tuid;
            ogCmd = cmd;
        }

        public String getOgCmd() {
            return ogCmd;
        }

        public int getId() {
            return id;
        }

        public int getFromUserId() {
            return fromUserId;
        }

        public int getToUserId() {
            return toUserId;
        }

        public JobType getJobType() {
            return jobType;
        }
    }

    public enum JobType {
        FOLLOW, UNFOLLOW, BROADCAST, PRIVATE_MSG, STATUS_UPDATE
    }


    public class JobHandlerThread extends Thread {

        @Override
        public void run() {

            Job job;
            int execJobCounter = 1;
            while (true) {
                synchronized (jobs) {
                    if (!jobs.containsKey(execJobCounter)) {
                        try {
                            jobs.wait();
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                        continue;
                    } else {
                        job = jobs.get(execJobCounter);
                    }
                }

                //execute job
                switch (job.getJobType()) {
                    case BROADCAST: {
                        for (Client c : connectedClients.values()) {
                            sendNotification(c, job);
                        }
                        break;
                    }
                    case UNFOLLOW: {
                        unfollow(job.getFromUserId(), job.getToUserId());
                        break;
                    }
                    case STATUS_UPDATE: {
                        //notify
                        HashSet<Integer> l = follows.get(job.getFromUserId());
                        if (l != null) {
                            for (int i : l) {
                                Client c = connectedClients.get(i);
                                sendNotification(c, job);
                            }
                        }
                        break;
                    }
                    case FOLLOW: {
                        follow(job.getFromUserId(), job.getToUserId());
                        //notify
                        Client c = connectedClients.get(job.getToUserId());
                        sendNotification(c, job);
                        break;
                    }
                    case PRIVATE_MSG: {
                        //notify
                        Client c = connectedClients.get(job.getToUserId());
                        sendNotification(c, job);
                        break;
                    }

                }
                execJobCounter++;
            }
        }

        public void unfollow(int unfollower, int followed) {
            follows.get(followed).remove(unfollower);
        }

        public void follow(int follower, int followed) {
            if (!follows.containsKey(followed)) {
                HashSet<Integer> hs = new HashSet<>();
                hs.add(follower);
                follows.put(followed, hs);
            } else {
                follows.get(followed).add(follower);
            }
        }

        public void sendNotification(Client c, Job job) {
            if (c != null) {
                try {
                    OutputStream out = c.getSocket().getOutputStream();
                    out.write(job.getOgCmd().getBytes());
                    char r = '\r';
                    out.write(r);
                    char n = '\n';
                    out.write(n);
                    out.flush();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }


    }

    public class ClientHandlerThread extends Thread {
        ServerSocket serverSocket = null;

        public ClientHandlerThread() {
            try {
                serverSocket = new ServerSocket(9099);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        @Override
        public void run() {
            while (true) {
                try {
                    Socket socket = serverSocket.accept();
                    pool.execute(new ClientIdSubmissionRunnable(socket));
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public class ClientIdSubmissionRunnable implements Runnable {

        private final Socket socket;

        public ClientIdSubmissionRunnable(Socket s) {
            socket = s;
        }

        @Override
        public void run() {

            try {
                BufferedReader br = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                StringBuilder sb = new StringBuilder();

                int nl;
                while ((nl = br.read()) != (int) '\n') {
                    sb.append(Integer.parseInt((new Character((char) nl)).toString()));
                }

                String sid = sb.toString();
                int id = Integer.parseInt(sid);

                Client c = new Client(id, socket);
                connectedClients.put(id, c);

            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public class JobSubmissionRunnable implements Runnable {

        private final String command;

        public JobSubmissionRunnable(String cmd) {
            command = cmd;
        }

        @Override
        public void run() {
            String[] cmd = command.split("\\|");
            Job job;
            switch (cmd[1]) {
                case "B": {
                    job = new Job(Integer.parseInt(cmd[0]), JobType.BROADCAST, 0, 0, command);
                    jobs.put(job.getId(), job);
                    break;
                }
                case "F": {
                    job = new Job(Integer.parseInt(cmd[0]), JobType.FOLLOW, Integer.parseInt(cmd[2]), Integer.parseInt(cmd[3]), command);
                    jobs.put(job.getId(), job);
                    break;
                }
                case "U": {
                    job = new Job(Integer.parseInt(cmd[0]), JobType.UNFOLLOW, Integer.parseInt(cmd[2]), Integer.parseInt(cmd[3]), command);
                    jobs.put(job.getId(), job);
                    break;
                }
                case "P": {
                    job = new Job(Integer.parseInt(cmd[0]), JobType.PRIVATE_MSG, Integer.parseInt(cmd[2]), Integer.parseInt(cmd[3]), command);
                    jobs.put(job.getId(), job);
                    break;
                }
                case "S": {
                    job = new Job(Integer.parseInt(cmd[0]), JobType.STATUS_UPDATE, Integer.parseInt(cmd[2]), 0, command);
                    jobs.put(job.getId(), job);
                    break;
                }
            }

            synchronized (jobs) {
                jobs.notifyAll();
            }

        }
    }

    public class EventHandlerThread extends Thread {

        public EventHandlerThread() {

        }

        @Override
        public void run() {

            ServerSocket serverSocket = null;
            Socket socket = null;


            while (true) {
                try {
                    serverSocket = new ServerSocket(9090);

                    socket = serverSocket.accept();

                    BufferedReader br = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                    StringBuilder sb = new StringBuilder();

                    int ch;
                    while ((ch = br.read()) != -1) {

                        if (ch == (int) '\n') {
                            String command = sb.toString();
                            sb.setLength(0);

                            event.execute(new JobSubmissionRunnable(command));
                        } else {
                            sb.append((char) ch);
                        }
                    }

                } catch (IOException e) {
                    e.printStackTrace();
                } finally {
                    //fechar sockets.
                    try {
                        if (serverSocket != null) serverSocket.close();
                    } catch (IOException e) {
                    }
                    try {
                        if (socket != null) socket.close();
                    } catch (IOException e) {
                    }
                }

            }

        }

    }

    public static void main(String[] args) {

        Main m = new Main();
    }
}
