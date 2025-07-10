import Reblend, { IAny, Placeholder, useMemo, useState } from "reblendjs";
import { redirectTo } from "reblend-router";
import { teamPreviewContext } from "../lib/contexts";
import { routes } from "../lib/routes";
import { ALL_TEAM, IMAGE_BASE } from "../lib/RestEndpoints";
import { ACTIVE } from "../lib/contants";
import ITeam from "../interfaces/ITeam";
import { useScroll } from "../lib/hooks";
import Paginator from "../components/Paginator";

export async function Team({ size }: { size?: number }) {
  useScroll();
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [teams, setTeams] = useState<ITeam[] | null>(null);

  const query = useMemo(() => {
    const option: IAny = {
      $in: {
        status: [ACTIVE],
      },
    };

    return option;
  }, []);

  async function chooseOption(team: ITeam) {
    await teamPreviewContext.update(team);
    const url = routes.teamPreview1.path.replace(":id", team._id);
    redirectTo(url);
  }

  return (
    <div class="container my-5">
      <div
        style={{
          display: "flex",
          flexDirection: "row" as any,
          flexWrap: "wrap" as any,
          alignContent: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!teams || loadingTeams ? (
          <Placeholder style={{ height: "500px", width: "100%" }} />
        ) : !teams?.length ? (
          <Placeholder
            style={{ height: "500px", width: "50em", animation: "none" }}
          >
            <b>No team found</b>
          </Placeholder>
        ) : (
          teams?.map((team) => (
            <div key={team._id}>
              {/*<!-- Single property-->*/}
              <div
                class="inflanar-service"
                style={{ width: "300px", margin: "5px" }}
              >
                {/*<!-- Property Head-->*/}
                <div class="inflanar-service__head">
                  <img
                    style={{ height: "200px" }}
                    src={
                      IMAGE_BASE + team?.uidPopulated.avatar ||
                      "/AgroInvest_icon.png"
                    }
                  />
                </div>
                {/*<!-- Property Body-->*/}
                <div class="inflanar-service__body">
                  <h5 class="inflanar-service__title text-black">
                    <a
                      onclick={(e) => {
                        e.preventDefault();
                        chooseOption(team);
                      }}
                      href={routes.teamPreview.path
                        .replace(":firstname", team.uidPopulated?.firstname)
                        .replace(":lastname", team.uidPopulated?.lastname)}
                      style={{
                        width: "100%",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        textWrap: "nowrap",
                      }}
                      title={`${
                        team.uidPopulated?.firstname +
                        " " +
                        team.uidPopulated?.lastname
                      }`}
                    >
                      {team.uidPopulated?.firstname +
                        " " +
                        team.uidPopulated?.lastname}
                    </a>
                  </h5>{" "}
                  <h6 class="">
                    <a
                      onclick={(e) => {
                        e.preventDefault();
                        chooseOption(team);
                      }}
                      href={routes.teamPreview.path
                        .replace(":firstname", team.uidPopulated?.firstname)
                        .replace(":lastname", team.uidPopulated?.lastname)}
                      style={{
                        width: "100%",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        textWrap: "nowrap",
                      }}
                      title={`${
                        team.uidPopulated?.firstname +
                        " " +
                        team.uidPopulated?.lastname
                      }`}
                    >
                      {team.title}
                    </a>
                  </h6>
                  <hr />
                  <div class="inflanar-service__top w-full">
                    <textarea
                      class="text-black"
                      //style="text-transform: uppercase;"
                      rows={5}
                      style={{
                        border: 0,
                        height: "fit-content",
                        width: "100%",
                      }}
                      readOnly
                      disabled
                    >
                      {team.profileIdPopulated?.bio}
                    </textarea>
                  </div>
                  <hr />
                </div>
              </div>
              {/*<!-- End Single property-->*/}
            </div>
          ))
        )}
      </div>
      <div class="container">
        <div class="mb-3 w-full flex flex-row justify-center align-items-center">
          <Paginator
            setResults={setTeams}
            setLoading={setLoadingTeams}
            url={ALL_TEAM}
            size={size || 6}
            query={query}
          />
        </div>
      </div>
    </div>
  );
}
