import got from "got";
import { load as cheerioLoad } from "cheerio";
import { Project } from "./types";

export const getProjectResults = async (searchQuery: string) => {
  const searchUrl = `https://www.drupal.org/search/site/${searchQuery}`;
  const { body } = await got(searchUrl, {
    headers: { "user-agent": "Raycast Drupal API Extension" },
  });
  const $ = cheerioLoad(body);
  const projectRows = $("ol.search-results li.search-result");

  const filteredByProject = projectRows.toArray().filter((item) => {
    const type = $(".search-info", item).text().trim();
    return type.includes("project") || type === "Group";
  });

  const projects: Project[] = filteredByProject.map((item) => {
    const projectLink = $("h3.title", item);
    const projectUrl = $("a", projectLink).attr("href");
    if (!projectUrl) {
      return {} as Project;
    }
    const createdBy = $(".username", item).text().trim();
    const record: Project = {
      title: $("h3.title", item).text().trim(),
      createdBy,
      description: $(".search-snippet", item).text().trim(),
      type: $(".search-info", item).text().trim().replace(" project", ""),
      url: projectUrl,
    };

    return record;
  });

  return projects;
};
