export function getContentTagTheme(category: string) {
  switch (category) {
    case "活动速递":
      return {
        pill: "bg-[#e5f1ff] text-[#4e78a8]",
        soft: "#dff4ff",
      };
    case "品牌活动":
      return {
        pill: "bg-[#e5efe4] text-[#4f7154]",
        soft: "#d8f8c5",
      };
    case "官宣":
      return {
        pill: "bg-[#ebe7f3] text-[#665a86]",
        soft: "#dcd7ff",
      };
    case "直播":
      return {
        pill: "bg-[#eef3c7] text-[#6d7c2b]",
        soft: "#eef7bf",
      };
    default:
      return {
        pill: "bg-[#f3efe8] text-[#6b6e72]",
        soft: "#fbfaf7",
      };
  }
}
