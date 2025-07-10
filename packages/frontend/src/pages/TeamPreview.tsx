import Reblend, {
  Placeholder,
  useContext,
  useEffect,
  useState,
} from "reblendjs";
import { teamPreviewContext } from "../lib/contexts";
import { RouteProps } from "reblend-router";
import fetcher from "../lib/SharedFetcher";
import AssetSwitch from "../components/AssetSwitch";
import { useScroll } from "../lib/hooks";
import ITeam from "../interfaces/ITeam";
import { TEAM, TEAM_PREVIEW } from "../lib/RestEndpoints";

export function TeamPreview({ params }: RouteProps) {
  const [teamContext] = useContext<ITeam | null>(teamPreviewContext);
  const [team, setTeam] = useState<ITeam | null>(teamContext);

  const [loadingTeam, setLoadingTeam] = useState(false);

  useEffect(() => {
    let url = "";
    if (teamContext) {
      setTeam(teamContext);
      return;
    } else if (params?.firstname && params?.lastname) {
      url = TEAM_PREVIEW.replace(":firstname", params?.firstname).replace(
        ":lastname",
        params?.lastname
      );
    } else {
      url = TEAM + params?.id;
    }
    setLoadingTeam(true);
    fetcher
      .fetch<ITeam>(url)
      .then((data) => {
        if (data?.connection?.status) {
          data.data && setTeam(data.data);
        }
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setLoadingTeam(false);
      });
  }, [teamContext, params?.teamId]);

  useScroll();

  return (
    <div class="flex flex-row flex-wrap justify-between p-2 container inflanar-supports overflow-x-auto">
      {loadingTeam ? (
        <Placeholder style={{ height: "500px" }} />
      ) : !team ? (
        <Placeholder style={{ height: "500px", animation: "initial" }}>
          <b>Detail not found</b>
        </Placeholder>
      ) : (
        <>
          <div class="h-fit xs:w-full sm:w-full md:w-3/5 lg:w-3/5 px-2">
            <AssetSwitch assets={[team?.uidPopulated.avatar]} />
          </div>
          <div class="xs:w-full sm:w-full md:w-2/5 lg:w-2/5 px-2">
            <div>
              <h2 class="py-2 my-1 overflow-x-auto">
                {team?.uidPopulated.firstname +
                  " " +
                  team?.uidPopulated.lastname}
              </h2>
              <h5 class="py-2 my-1 overflow-x-auto">{team.title}</h5>
              <p class="py-2 my-1">
                <hr />
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
                <hr />
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
