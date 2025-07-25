import Reblend, { FC, useEffect, useProps, useState } from "reblendjs";
import { Tab } from "../components/basics/Tab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { redirectTo, RouteProps } from "reblend-router";
import { routes } from "../lib/routes";
import { IAnimalInvestment } from "../interfaces/IAnimalInvestment";
import { IChickenInvestment } from "../interfaces/IChickenInvestment";
import { ICropInvestment } from "../interfaces/ICropInvestment";
import { IFarmInvestment } from "../interfaces/IFarmInvestment";
import { ILandInvestment } from "../interfaces/ILandInvestment";
import { useAllowAthenticated } from "../lib/hooks";
import { Input } from "../components/basics/Input";
import {
  ALL_ANIMAL_INVESTMENT,
  ALL_CHICKEN_INVESTMENT,
  ALL_CROP_INVESTMENT,
  ALL_FARM_INVESTMENT,
  ALL_LAND_INVESTMENT,
  HOT_INVESTMENT,
  IMAGE_BASE,
} from "../lib/RestEndpoints";
import Paginator from "../components/Paginator";
import fetcher from "../lib/SharedFetcher";
import { alertError, paginatingUrl } from "../lib/misc";
import { Humanize } from "../components/HumanizeTimestamp";

export const Investments: FC<RouteProps & { onlyFor?: "hot" }> = ({
  onlyFor,
  params,
}) => {
  useAllowAthenticated();

  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(false);

  const [activeTab, setActiveTab] = useState<string | typeof onlyFor>(
    onlyFor || params?.tab || "hot"
  );

  useProps(() => {
    if (params?.tab) {
      setActiveTab(params?.tab);
    } else if (!onlyFor) {
      redirectTo(routes.investments.redirectUri + "/hot");
    }
  });

  const [hotInvestments, setHotInvestments] = useState<
    | (
        | IAnimalInvestment
        | IChickenInvestment
        | ICropInvestment
        | ILandInvestment
        | IFarmInvestment
      )[]
    | null
  >(null);

  const [animalInvestments, setAnimalInvestments] = useState<
    IAnimalInvestment[] | null
  >(null);
  const [chickenInvestments, setChickenInvestments] = useState<
    IChickenInvestment[] | null
  >(null);
  const [cropInvestments, setCropInvestments] = useState<
    ICropInvestment[] | null
  >(null);
  const [landInvestments, setLandInvestments] = useState<
    ILandInvestment[] | null
  >(null);
  const [farmInvestments, setFarmInvestments] = useState<
    IFarmInvestment[] | null
  >(null);

  const [search, setSearch] = useState("");

  const tabs = [
    {
      key: "hot",
      label: "Hot",
    },
    {
      key: "farm",
      label: "Farm Land",
    },
    {
      key: "crop",
      label: "Crop",
    },
    {
      key: "chicken",
      label: "Poutry",
    },
    {
      key: "animal",
      label: "Livestock",
    },
    {
      key: "land",
      label: "Land Sale",
    },
  ];

  useEffect(() => {
    fetchHotInvestments();
  }, [onlyFor, search]);

  const fetchHotInvestments = async () => {
    setLoading(true);
    fetcher
      .fetch(
        paginatingUrl(HOT_INVESTMENT, {
          name: search,
        })
      )
      .then((data) => {
        if (data?.connection?.status) {
          setHotInvestments(data.data as any);
        } else {
          alertError(data?.connection?.message || "Error");
          setHotInvestments([]);
        }
      })
      .catch((err) => {
        alertError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div class="">
      {onlyFor ? null : (
        <>
          <div class="text-2xl font-bold text-neutral-900 mb-1">Investment</div>
          <div class="text-neutral-500 mb-4">
            Join another users to invest in amazing opportunities
          </div>

          {/* <Tab active={tab1} tabs={tabs1} onTab={setTab1} /> */}

          <div class="mb-4">
            <Input
              leftIcon={<FontAwesomeIcon icon={faSearch} />}
              placeholder="Search"
              value={search}
              onchange={(e) => setSearch((e.target as HTMLInputElement).value)}
            />
          </div>

          {/* Tabs for All/Active/Completed or All/Owned */}
          <Tab
            active={activeTab!}
            tabs={tabs}
            onTab={(tb) =>
              redirectTo(routes.investments.redirectUri + "/" + tb)
            }
          />
        </>
      )}

      <div class="flex flex-col gap-4">
        <div class="error">
          {loading ? (
            <span>
              Loading please wait...{" "}
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
            </span>
          ) : loadingError ? (
            "Could not load all the data, please try again"
          ) : (
            ""
          )}
        </div>
        {/* --------------- Hot Investments ----------------- */}
        {activeTab !== "hot" ? null : (
          <div class="flex flex-col gap-4">
            {hotInvestments?.map((investment) => (
              <div
                key={investment._id}
                class="relative w-full min-h-[220px] max-h-[260px] rounded-2xl overflow-hidden shadow bg-white"
              >
                <img
                  src={IMAGE_BASE + investment.assets[0]}
                  alt={""}
                  class="w-full h-32 object-cover"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent cursor-pointer hover:m-1 hover:rounded-lg hover:border hover:border-brand"
                  onclick={() =>
                    redirectTo(
                      `${routes.investment.redirectUri}/${
                        (investment as any).type
                      }/${investment._id}`
                    )
                  }
                />
                {!investment.featureNo ? null : (
                  <span class="absolute top-2 right-2 bg-warning-100 text-warning-600 rounded-full px-2 py-1 text-xs font-bold">
                    🔥
                  </span>
                )}
                <div class="absolute top-2 left-2 text-xs text-white font-bold bg-black/30 px-2 py-1 rounded">
                  {investment.remainingUnits || 0}/{investment.units} Slots
                </div>
                <div class="absolute bottom-4 left-4 z-10">
                  <div class="text-lg font-bold text-white mb-1">
                    {investment.name}
                  </div>
                  <div class="text-white text-sm mb-1">
                    {(investment as any).roi
                      ? `${(investment as any).roi}%`
                      : ""}{" "}
                    {!(investment as IAnimalInvestment).maturityDate ? (
                      ""
                    ) : (
                      <>
                        in{" "}
                        <Humanize
                          earlierDate={new Date(
                            (investment as IAnimalInvestment).maturityDate
                          ).getTime()}
                          laterDate={new Date(
                            (investment as IAnimalInvestment).closingDate
                          ).getTime()}
                        />
                      </>
                    )}{" "}
                  </div>
                  <div class="text-white font-bold">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    }).format(investment.pricePerUnit)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --------------- Animal Investments ----------------- */}
        {activeTab !== "animal" ? null : (
          <div class="flex flex-col gap-4">
            {animalInvestments?.map((investment) => (
              <div
                key={investment._id}
                class="relative w-full min-h-[220px] max-h-[260px] rounded-2xl overflow-hidden shadow bg-white"
              >
                <img
                  src={IMAGE_BASE + investment.assets[0]}
                  alt={""}
                  class="w-full h-32 object-cover"
                />
                {!investment.featureNo ? null : (
                  <span class="absolute top-2 right-2 bg-warning-100 text-warning-600 rounded-full px-2 py-1 text-xs font-bold">
                    🔥
                  </span>
                )}
                <div class="absolute top-2 left-2 text-xs text-white font-bold bg-black/30 px-2 py-1 rounded">
                  {investment.remainingUnits || 0}/{investment.units} Slots
                </div>
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent cursor-pointer hover:m-1 hover:rounded-lg hover:border hover:border-brand"
                  onclick={() =>
                    redirectTo(
                      `${routes.investment.redirectUri}/animal/${investment._id}`
                    )
                  }
                />
                <div class="absolute bottom-4 left-4 z-10">
                  <div class="text-lg font-bold text-white mb-1">
                    {investment.name}
                  </div>
                  <div class="text-white text-sm mb-1">
                    {(investment as any).roi
                      ? `${(investment as any).roi}%`
                      : ""}{" "}
                    {!(investment as IAnimalInvestment).maturityDate ? (
                      ""
                    ) : (
                      <>
                        in{" "}
                        <Humanize
                          earlierDate={new Date(
                            (investment as IAnimalInvestment).maturityDate
                          ).getTime()}
                          laterDate={new Date(
                            (investment as IAnimalInvestment).closingDate
                          ).getTime()}
                        />
                      </>
                    )}{" "}
                  </div>
                  <div class="text-white font-bold">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    }).format(investment.pricePerUnit)}
                  </div>
                </div>
              </div>
            ))}
            <Paginator
              query={{ name: search }}
              url={ALL_ANIMAL_INVESTMENT}
              setResults={(result: any) => setAnimalInvestments(result)}
              size={5}
              setLoading={setLoading}
              setLoadingError={setLoadingError}
            />
          </div>
        )}

        {/* --------------- Chicken Investments ----------------- */}
        {activeTab !== "chicken" ? null : (
          <div class="flex flex-col gap-4">
            {" "}
            {chickenInvestments?.map((investment) => (
              <div
                key={investment._id}
                class="relative w-full min-h-[220px] max-h-[260px] rounded-2xl overflow-hidden shadow bg-white"
              >
                <img
                  src={IMAGE_BASE + investment.assets[0]}
                  alt={""}
                  class="w-full h-32 object-cover"
                />
                {!investment.featureNo ? null : (
                  <span class="absolute top-2 right-2 bg-warning-100 text-warning-600 rounded-full px-2 py-1 text-xs font-bold">
                    🔥
                  </span>
                )}
                <div class="absolute top-2 left-2 text-xs text-white font-bold bg-black/30 px-2 py-1 rounded">
                  {investment.remainingUnits || 0}/{investment.units} Slots
                </div>
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent cursor-pointer hover:m-1 hover:rounded-lg hover:border hover:border-brand"
                  onclick={() =>
                    redirectTo(
                      `${routes.investment.redirectUri}/chicken/${investment._id}`
                    )
                  }
                />
                <div class="absolute bottom-4 left-4 z-10">
                  <div class="text-lg font-bold text-white mb-1">
                    {investment.name}
                  </div>
                  <div class="text-white text-sm mb-1">
                    {(investment as any).roi
                      ? `${(investment as any).roi}%`
                      : ""}{" "}
                    {!(investment as IAnimalInvestment).maturityDate ? (
                      ""
                    ) : (
                      <>
                        in{" "}
                        <Humanize
                          earlierDate={new Date(
                            (investment as IAnimalInvestment).maturityDate
                          ).getTime()}
                          laterDate={new Date(
                            (investment as IAnimalInvestment).closingDate
                          ).getTime()}
                        />
                      </>
                    )}{" "}
                  </div>
                  <div class="text-white font-bold">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    }).format(investment.pricePerUnit)}
                  </div>
                </div>
              </div>
            ))}
            <Paginator
              query={{ name: search }}
              url={ALL_CHICKEN_INVESTMENT}
              setResults={(result: any) => setChickenInvestments(result)}
              size={5}
              setLoading={setLoading}
              setLoadingError={setLoadingError}
            />
          </div>
        )}

        {/*---------------  Crop Investments ----------------- */}
        {activeTab !== "crop" ? null : (
          <div class="flex flex-col gap-4">
            {cropInvestments?.map((investment) => (
              <div
                key={investment._id}
                class="relative w-full min-h-[220px] max-h-[260px] rounded-2xl overflow-hidden shadow bg-white"
              >
                <img
                  src={IMAGE_BASE + investment.assets[0]}
                  alt={""}
                  class="w-full h-32 object-cover"
                />
                {!investment.featureNo ? null : (
                  <span class="absolute top-2 right-2 bg-warning-100 text-warning-600 rounded-full px-2 py-1 text-xs font-bold">
                    🔥
                  </span>
                )}
                <div class="absolute top-2 left-2 text-xs text-white font-bold bg-black/30 px-2 py-1 rounded">
                  {investment.remainingUnits || 0}/{investment.units} Slots
                </div>
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent cursor-pointer hover:m-1 hover:rounded-lg hover:border hover:border-brand"
                  onclick={() =>
                    redirectTo(
                      `${routes.investment.redirectUri}/crop/${investment._id}`
                    )
                  }
                />
                <div class="absolute bottom-4 left-4 z-10">
                  <div class="text-lg font-bold text-white mb-1">
                    {investment.name}
                  </div>
                  <div class="text-white text-sm mb-1">
                    {(investment as any).roi
                      ? `${(investment as any).roi}%`
                      : ""}{" "}
                    {!(investment as IAnimalInvestment).maturityDate ? (
                      ""
                    ) : (
                      <>
                        in{" "}
                        <Humanize
                          earlierDate={new Date(
                            (investment as IAnimalInvestment).maturityDate
                          ).getTime()}
                          laterDate={new Date(
                            (investment as IAnimalInvestment).closingDate
                          ).getTime()}
                        />
                      </>
                    )}{" "}
                  </div>{" "}
                  <div class="text-white font-bold">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    }).format(investment.pricePerUnit)}
                  </div>
                </div>
              </div>
            ))}
            <Paginator
              query={{ name: search }}
              url={ALL_CROP_INVESTMENT}
              setResults={(result: any) => setCropInvestments(result)}
              size={5}
              setLoading={setLoading}
              setLoadingError={setLoadingError}
            />
          </div>
        )}

        {/*---------------  Land Investments ----------------- */}
        {activeTab !== "land" ? null : (
          <div class="flex flex-col gap-4">
            {landInvestments?.map((investment) => (
              <div
                key={investment._id}
                class="relative w-full min-h-[220px] max-h-[260px] rounded-2xl overflow-hidden shadow bg-white"
              >
                <img
                  src={IMAGE_BASE + investment.assets[0]}
                  alt={""}
                  class="w-full h-32 object-cover"
                />
                {!investment.featureNo ? null : (
                  <span class="absolute top-2 right-2 bg-warning-100 text-warning-600 rounded-full px-2 py-1 text-xs font-bold">
                    🔥
                  </span>
                )}
                <div class="absolute top-2 left-2 text-xs text-white font-bold bg-black/30 px-2 py-1 rounded">
                  {investment.remainingUnits || 0}/{investment.units} Slots
                </div>
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent cursor-pointer hover:m-1 hover:rounded-lg hover:border hover:border-brand"
                  onclick={() =>
                    redirectTo(
                      `${routes.investment.redirectUri}/land/${investment._id}`
                    )
                  }
                />
                <div class="absolute bottom-4 left-4 z-10">
                  <div class="text-lg font-bold text-white mb-1">
                    {investment.name}
                  </div>
                  {/* <div class="text-white text-sm mb-1">
                      {(investment as any).roi
                        ? `${(investment as any).roi}%`
                        : ""}{" "}
                      {!(investment as IAnimalInvestment).maturityDate ? (
                        ""
                      ) : (
                        <>
                          in{" "}
                          <Humanize
                            earlierDate={new Date(
                              (investment as IAnimalInvestment).maturityDate
                            ).getTime()}
                            laterDate={new Date(
                              (investment as IAnimalInvestment).closingDate
                            ).getTime()}
                          />
                        </>
                      )}{" "}
                    </div> */}
                  <div class="text-white font-bold">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    }).format(investment.pricePerUnit)}
                  </div>
                </div>
              </div>
            ))}
            <Paginator
              query={{ name: search }}
              url={ALL_LAND_INVESTMENT}
              setResults={(result: any) => setLandInvestments(result)}
              size={5}
              setLoading={setLoading}
              setLoadingError={setLoadingError}
            />
          </div>
        )}

        {/*---------------  Farm Investments ----------------- */}
        {activeTab !== "farm" ? null : (
          <div class="flex flex-col gap-4">
            {farmInvestments?.map((investment) => (
              <div
                key={investment._id}
                class="relative w-full min-h-[220px] max-h-[260px] rounded-2xl overflow-hidden shadow bg-white"
              >
                <img
                  src={IMAGE_BASE + investment.assets[0]}
                  alt={""}
                  class="w-full h-32 object-cover"
                />
                {!investment.featureNo ? null : (
                  <span class="absolute top-2 right-2 bg-warning-100 text-warning-600 rounded-full px-2 py-1 text-xs font-bold">
                    🔥
                  </span>
                )}
                <div class="absolute top-2 left-2 text-xs text-white font-bold bg-black/30 px-2 py-1 rounded">
                  {investment.remainingUnits || 0}/{investment.units} Slots
                </div>
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent cursor-pointer hover:m-1 hover:rounded-lg hover:border hover:border-brand"
                  onclick={() =>
                    redirectTo(
                      `${routes.investment.redirectUri}/farm/${investment._id}`
                    )
                  }
                />
                <div class="absolute bottom-4 left-4 z-10">
                  <div class="text-lg font-bold text-white mb-1">
                    {investment.name}
                  </div>
                  <div class="text-white text-sm mb-1">
                    {(investment as any).roi
                      ? `${(investment as any).roi}%`
                      : ""}{" "}
                    {!(investment as IAnimalInvestment).maturityDate ? (
                      ""
                    ) : (
                      <>
                        in{" "}
                        <Humanize
                          earlierDate={new Date(
                            (investment as IAnimalInvestment).maturityDate
                          ).getTime()}
                          laterDate={new Date(
                            (investment as IAnimalInvestment).closingDate
                          ).getTime()}
                        />
                      </>
                    )}{" "}
                  </div>
                  <div class="text-white font-bold">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    }).format(investment.pricePerUnit)}
                  </div>
                </div>
              </div>
            ))}
            <Paginator
              query={{ name: search }}
              url={ALL_FARM_INVESTMENT}
              setResults={(result: any) => setFarmInvestments(result)}
              size={5}
              setLoading={setLoading}
              setLoadingError={setLoadingError}
            />
          </div>
        )}
      </div>
    </div>
  );
};
