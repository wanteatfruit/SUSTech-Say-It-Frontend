import { postInterface } from "@/interfaces/postInterface";
import { sortByViewCount } from "@/pages/api/PostAPI";
import { Input, InputGroup, InputRightElement, Icon } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { BiSearch } from "react-icons/bi";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

export default function SearchBar() {
  const search_data: postInterface[] = [];
  const [items, setItems] = useState(search_data);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(false);
    async function refresh() {
      const data = await sortByViewCount();
      setItems(data);
    }
    refresh();
    setLoaded(true);
  }, []);

  const handleOnSearch = (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    console.log(items);
    console.log(string, results);
  };

  const handleOnHover = (result) => {
    // the item hovered
    console.log(result);
    const hoveredElement = document.getElementById("result");
    if (hoveredElement) {
      hoveredElement.style.cursor = "pointer";
    }
  };

  const handleOnSelect = (item: postInterface) => {
    // the item selected
    window.location.href = `/posts/${item.id}`;
  };

  const handleOnFocus = () => {
    console.log("Focused");
  };

  const spaceDict = {
    1: "升学交流",
    2: "闲聊",
    3: "课程交流",
  };

  const formatResult = (item: postInterface) => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <span id="result" style={{ display: "block", textAlign: "left" }}>
          {item.title.length > 15
            ? item.title.substring(0, 15) + "..."
            : item.title}
        </span>
        <span style={{ textAlign: "left", marginRight: 20 }}>
          {spaceDict[item.spaceid]}
        </span>
      </div>
    );
  };
  return (
    <div>
      {loaded && (
        <ReactSearchAutocomplete
          items={items}
          onSearch={handleOnSearch}
          fuseOptions={{ keys: ["title", "content"] }}
          // resultStringKeyName="title"
          formatResult={formatResult}
          onHover={handleOnHover}
          onSelect={handleOnSelect}
          onFocus={handleOnFocus}
          autoFocus
          styling={{
            border: "1px solid var(--minimal-2)",
            borderRadius: "12px",
            boxShadow: "4px",
            fontFamily: "Roboto",
            hoverBackgroundColor: "var(--minimal-2)",
            zIndex: 99999,
          }}
        ></ReactSearchAutocomplete>
      )}
    </div>
  );
}
