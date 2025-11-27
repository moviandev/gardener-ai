import base64
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage

class VisionService:
  def __init__(self):
    self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)

  def analyze_image(self, image_base64: str) -> str:
    if not image_base64:
      return ""

    if "base64," in image_base64:
      image_base64 = image_base64.split("base64,")[1]

    message = HumanMessage(
      content=[
          {
            "type": "text", 
            "text": (
                "Describe this plant in detail. Identify the species if possible. "
                "Look closely for any signs of disease, pests, yellowing, or dryness. "
                "Provide a concise botanical description."
            )
          },
          {
            "type": "image_url",
            "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"},
          },
      ]
    )

    try:
        response = self.llm.invoke([message])
        description = response.content
        return description
    except Exception as e:
        return "Error analyzing image."

# Teste manual (opcional)
if __name__ == "__main__":
    # Para testar, você precisaria de uma string base64 real aqui.
    pass