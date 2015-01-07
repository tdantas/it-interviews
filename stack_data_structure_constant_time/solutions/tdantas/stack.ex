defmodule Stack do
  defstruct items: [], min: []

  def push(element) do
    %Stack{items: [element], min: [element] }
  end

  def push(%Stack{ items: [stack], min: [first | rest] }, element) do
    newMin = Enum.min([first, element])
    %Stack{items: [element | stack], min: [newMin|[first|rest]]}
  end

  def pop(%Stack{items: [top | rest], min: [ _ | tail ] }) do
    {top, %Stack{items: rest, min: tail }}
  end

  def getMin(stack) do
    [ min| _ ]  = stack.min;
    min
  end

end

