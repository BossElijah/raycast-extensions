import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { useEffect, useState } from "react";
import { getProjectResults } from "./utils/search-projects/util";
import { ApiState } from "./utils/search-projects/types";

const SearchProjects = () => {
  const [state, setState] = useState<ApiState>({});
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setState({ records: state.records, loading: true });
        const feed = await getProjectResults(searchText);
        setState({ records: feed, loading: false });
      } catch (error) {
        console.error(error);
        setState({
          error: error instanceof Error ? error : new Error("Something went wrong"),
        });
      }
    };

    fetchRecords();
  }, [searchText]);

  let noResultsText = "No results...";
  let noResultsIcon: Icon | null = Icon.Important;
  if (!state.loading && !searchText) {
    noResultsText = "Type something to search.";
    noResultsIcon = null;
  }
  if (state.error) {
    noResultsText = "Error: " + state.error.message;
  }
  if (state.loading) {
    noResultsText = "Loading...";
    noResultsIcon = Icon.CircleProgress;
    if (searchText) {
      noResultsText = "Searching...";
    }
  }

  // title: string;
  // type: string;
  // description: string;
  // url: string;
  // createdBy: string;
  // createdByUrl: string;

  return (
    <List
      isLoading={state.loading || !state.records}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      throttle
      searchBarPlaceholder="Search for Drupal projects..."
      isShowingDetail
      filtering={false}
    >
      <List.EmptyView title={noResultsText} icon={noResultsIcon} />
      {state.records?.map((item, index) => {
        const detailsMarkdown = `# ${item.title}\n\n**Type:** ${item.type}\n\n**Description**: ${item.description}\n\n**Created by**: ${item.createdBy}\n\n[See project on Drupal.org](${item.url})`;

        return (
          <List.Item
            key={index}
            title={item.title}
            accessories={[{ text: item.type }]}
            detail={<List.Item.Detail markdown={detailsMarkdown} />}
            actions={
              <ActionPanel>
                <Action.OpenInBrowser url={item.url} />
                <Action.CopyToClipboard title="Copy URL to Clipboard" content={item.url} />
                <Action.CopyToClipboard
                  title="Copy Title to Clipboard"
                  content={item.title}
                  shortcut={{ modifiers: ["opt", "cmd"], key: "t" }}
                />
              </ActionPanel>
            }
          />
        );
      })}
    </List>
  );
};

export default SearchProjects;
