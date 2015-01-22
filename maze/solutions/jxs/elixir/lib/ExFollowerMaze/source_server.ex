defmodule ExFollowerMaze.SourceServer do

  def accept(port) do
    {:ok, socket} = :gen_tcp.listen(port, [:binary, packet: :line, active: false])
    IO.puts "Accepting events source on port #{port}"
    {:ok, client} = :gen_tcp.accept(socket)
    loop_acceptor(client, %HashDict{}, 1)
  end

  defp parse_event(data) do
    data
    |> String.rstrip()
    |> String.split("|")
  end

  defp check_send_event(events, current_event) do
    case HashDict.get(events, Integer.to_string(current_event)) do
      nil ->
        {events, current_event}
      event ->
        send(:clientsserver, event)
        events = HashDict.delete(events, Integer.to_string(current_event))
        current_event = current_event + 1
        check_send_event(events, current_event)
    end
  end

  defp loop_acceptor(client, events, current_event) do
    {status, data} = :gen_tcp.recv(client, 0)
    case {status, data} do
      {:ok, data} ->
        event = parse_event(data)
        events = HashDict.put(events, hd(event), event)
        {events, current_event} = check_send_event(events, current_event)
        loop_acceptor(client, events, current_event)
      {status, _} ->
        IO.inspect(status)
        IO.puts "Finished receiving events"
    end
  end

end
