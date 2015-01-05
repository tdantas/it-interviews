defmodule Anagramer do

  def run(words) do
    words
    |> Enum.map(&mapper/1)
    |> Enum.reduce(%{ }, &reducer/2)
    |> Dict.values
  end

  defp mapper(item) do
    item
    |> to_char_list
    |> Enum.sort
    |> to_string
    |> List.wrap
    |> Enum.concat([item])
  end

  def reducer([key, value], acc) do
    case Dict.get(acc, key) do
      nil -> Dict.put(acc, key, [value])
      values -> Dict.put(acc, key, [ value | values ])
    end
  end
end

