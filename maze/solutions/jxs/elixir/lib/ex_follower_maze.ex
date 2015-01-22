defmodule ExFollowerMaze do
  use Application

  def start(_type, _args) do
    import Supervisor.Spec, warn: false
    children = [
        worker(Task, [ExFollowerMaze.ClientsServer, :accept, [9099]], id: :clientsserver),
        worker(Task, [ExFollowerMaze.SourceServer, :accept, [9090]], id: :sourceserver)
    ]
    opts = [strategy: :one_for_one, name: ExFollowerMaze.Supervisor]
    Supervisor.start_link(children, opts)
  end

end
