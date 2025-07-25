import Reblend, { FC, useEffect, useMemo, useState } from "reblendjs";
import { Button } from "../components/basics/Button";
import { Modal } from "../components/basics/Modal";
import AssetSwitch from "../components/AssetSwitch";
import { useAllowAthenticated, useScroll } from "../lib/hooks";
import { redirectTo, RouteProps } from "reblend-router";
import { IAnimalInvestment } from "../interfaces/IAnimalInvestment";
import { IChickenInvestment } from "../interfaces/IChickenInvestment";
import { ICropInvestment } from "../interfaces/ICropInvestment";
import { ILandInvestment } from "../interfaces/ILandInvestment";
import { IFarmInvestment } from "../interfaces/IFarmInvestment";
import fetcher from "../lib/SharedFetcher";
import { alertError, alertSuccess } from "../lib/misc";
import {
  ANIMAL_INVESTMENT,
  CHICKEN_INVESTMENT,
  CROP_INVESTMENT,
  FARM_INVESTMENT,
  INVESTMENT,
  LAND_INVESTMENT,
} from "../lib/RestEndpoints";
import { Humanize } from "../components/HumanizeTimestamp";
import { routes } from "../lib/routes";

export const Investment: FC<RouteProps> = ({
  //@ts-ignore
  params: { investmentId, investmentType },
}) => {
  useAllowAthenticated();
  useScroll();
  const [buying, setBuying] = useState(false);
  const [shares, setShares] = useState(1);
  const total = useMemo(() => {
    return shares * investment?.pricePerUnit!;
  });
  const [loading, setLoading] = useState(false);

  const [investment, setInvestment] = useState<
    | (
        | IAnimalInvestment
        | IChickenInvestment
        | ICropInvestment
        | ILandInvestment
        | IFarmInvestment
      )
    | null
    | undefined
  >(null);

  useEffect(() => {
    setShares(investment?.minUnits || 1);
  }, investment?.minUnits);

  useEffect(() => {
    fetchInvestment(investmentId, investmentType);
  }, [investmentId, investmentType]);

  const fetchInvestment = async (id: string, type: string) => {
    setLoading(true);
    let url = "";
    switch (type) {
      case "animal":
        url = ANIMAL_INVESTMENT;
        break;
      case "chicken":
        url = CHICKEN_INVESTMENT;
        break;
      case "crop":
        url = CROP_INVESTMENT;
        break;
      case "land":
        url = LAND_INVESTMENT;
        break;
      case "farm":
        url = FARM_INVESTMENT;
        break;

      default:
        break;
    }

    url += id;

    fetcher
      .fetch(url)
      .then((data) => {
        if (data?.connection?.status) {
          setInvestment(data.data as any);
        } else {
          alertError(data?.connection?.message || "Error");
          setInvestment(undefined);
          redirectTo(routes.investments.redirectUri);
        }
      })
      .catch((err) => {
        alertError(err.message);
        redirectTo(routes.investments.redirectUri);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const purchase = async () => {
    setLoading(true);

    const options = {
      url: INVESTMENT,
      data: {
        investmentType,
        investmentId,
        unit: shares,
      },
    };

    fetcher
      .fetch(options)
      .then((data) => {
        if (data?.connection?.status) {
          redirectTo(routes.invest.redirectUri);
          alertSuccess(data?.connection?.message);
        } else {
          alertError(data?.connection?.message || "Error");
        }
      })
      .catch((err) => {
        alertError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return !investment ? null : (
    <div class="flex flex-col gap-4">
      {loading ? "Loading please wait..." : ""}

      {/* Image Card */}
      <div class="">
        <div class="rounded-2xl overflow-hidden shadow bg-white">
          <AssetSwitch imageClass="w-full h-80" assets={investment?.assets!} />
        </div>
      </div>
      {/* Title and Price */}
      <div class="flex flex-row items-center justify-between ">
        <div>
          <div class="text-xl font-bold text-neutral-900 mb-1">
            {investment?.name}
          </div>
          <div class="text-neutral-500 text-sm">
            Minimum Share: {investment?.minUnits}
          </div>
        </div>
        <div class="text-right">
          <div class="font-bold text-brand-900 text-lg">
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            }).format(investment?.pricePerUnit!)}
          </div>
          <div class="text-neutral-400 text-xs">
            {(investment?.remainingUnits || 0).toLocaleString()}/
            {(investment?.units || 0).toLocaleString()} Shares
          </div>
        </div>
      </div>
      {/* Shares Available */}
      <div class="">
        <div class="rounded-2xl border border-neutral-200 bg-white px-4 py-4 text-lg font-semibold text-neutral-700">
          Shares Available:{" "}
          <span class="font-bold text-2xl">
            {(investment?.remainingUnits || 0).toLocaleString()}
          </span>
        </div>
      </div>
      {/* Market Cap & Returns */}
      <div class="flex flex-row items-center justify-between mt-6 mb-2">
        <div>
          <div class="text-xs font-bold text-neutral-500 mb-1">MARKET CAP</div>
          <div class="text-lg text-neutral-900">
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            }).format(investment?.pricePerUnit! * (investment?.units || 0)!)}
          </div>
        </div>
        <div class="text-right">
          <div class="text-xs font-bold text-neutral-500 mb-1">
            EST. RETURNS
          </div>
          <div class="text-lg text-neutral-900">
            {(investment as any)?.roi ? `${(investment as any).roi}%` : ""}{" "}
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
        </div>
      </div>
      {/* About Project */}
      <div class="">
        <div class="text-xs font-bold text-neutral-500 mb-1">
          ABOUT THIS PROJECT
        </div>
        <div class="text-neutral-700 whitespace-pre-line text-base mb-5">
          {investment?.description}
        </div>
      </div>
      {/* Buy Shares Modal */}
      <Modal open={buying} onClose={() => setBuying(false)}>
        <div class="flex flex-col gap-4">
          <div class="flex flex-row items-center justify-between">
            <div class="text-xl font-bold text-neutral-900">
              {investment?.name}
            </div>
            <div class="font-bold text-brand-900 text-lg">
              {investment?.pricePerUnit.toLocaleString("en-NG", {
                minimumFractionDigits: 2,
                style: "currency",
                currency: "NGN",
              })}{" "}
              <span class="text-sm font-normal">Per Share</span>
            </div>
          </div>
          <div class="text-neutral-700 mb-2">How many shares do you want?</div>
          <div class="flex flex-row items-center justify-between bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-4 mb-2">
            <button
              class="bg-neutral-100 rounded-xl w-12 h-12 flex items-center justify-center text-2xl text-brand-800"
              onClick={() =>
                setShares(
                  Math.max(investment.minUnits, shares - investment.minUnits)
                )
              }
            >
              -
            </button>
            <span class="text-2xl font-bold">{shares}</span>
            <button
              class="bg-neutral-100 rounded-xl w-12 h-12 flex items-center justify-center text-2xl text-brand-800"
              onClick={() =>
                setShares(
                  shares < investment.remainingUnits ? shares + 1 : shares
                )
              }
            >
              +
            </button>
          </div>
          <div class="text-center text-neutral-700">
            Shares Available:{" "}
            <span class="font-bold">
              {(investment?.remainingUnits || 0).toLocaleString()}
            </span>
          </div>
          <div class="rounded-2xl border border-neutral-200 bg-white px-4 py-4 text-lg font-semibold text-brand-900">
            <div class="text-xs text-neutral-500 mb-1">Total Amount</div>₦
            {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div class="text-neutral-500 text-sm">
            By clicking "Continue to payment" below, you accept the{" "}
            <a href="#" class="text-warning-600 underline">
              Terms of this investment
            </a>
            .
          </div>
          <Button className="w-full" onclick={purchase}>
            Purchase
          </Button>
        </div>
      </Modal>

      {/* Buy Shares Button */}
      <Button className="" onClick={() => setBuying(true)}>
        Buy Shares
      </Button>
    </div>
  );
};
