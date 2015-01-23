defmodule ExFollowerMaze.ClientsServer do

  def accept(port) do
    Process.register(self, :clientsserver)
    {:ok, socket} = :gen_tcp.listen(port, [:binary, packet: :line, active: false])
    IO.puts "Accepting clients on port #{port}"
    {:ok, clients_agent} = Agent.start_link(fn -> %{} end)
    Task.start_link(fn-> loop_acceptor(socket, clients_agent) end)
    handle_events(clients_agent, %{})
  end

  defp loop_acceptor(socket, clients_list) do
    {status, client} = :gen_tcp.accept(socket)
    case {status, client } do
      {:ok, client} ->
        {:ok, data} = :gen_tcp.recv(client, 0)
        client_id = String.rstrip(data)
        Agent.update(clients_list, &Map.put(&1, client_id, client))
        loop_acceptor(socket, clients_list)
      {status, _} ->
        IO.puts "no more clients"
        IO.inspect(status)
        loop_acceptor(socket, clients_list)
    end
  end

  defp handle_events(clients_agent, followers_map) do
    receive do
      event ->
        output = Enum.join(event, "|") <> "\n"
        case event do
          [_ , "B"] ->
            clients_list = Agent.get(clients_agent, fn list -> list end)
            Enum.each(clients_list, fn{_, client} -> :gen_tcp.send(client, output) end)
            handle_events(clients_agent, followers_map)
          [_ , "S", client_id] ->
            followers = Map.get(followers_map, client_id) || []
            Enum.each followers, fn(follower) ->
              client = Agent.get(clients_agent, &Map.get(&1, follower))
              if client, do: :gen_tcp.send(client, output)
            end
            handle_events(clients_agent, followers_map)
          [_, "F", follower, client_id] ->
            followers = Map.get(followers_map, client_id) || []
            followers_map = Map.put(followers_map, client_id, [follower | followers])
            client = Agent.get(clients_agent, &Map.get(&1, client_id))
            if client, do: :gen_tcp.send(client, output)
            handle_events(clients_agent, followers_map)
          [_, "P", _, client_id] ->
            client = Agent.get(clients_agent, &Map.get(&1, client_id))
            if client, do: :gen_tcp.send(client, output)
            handle_events(clients_agent, followers_map)
          _ ->
            handle_events(clients_agent, followers_map)
        end
    end
  end
end
