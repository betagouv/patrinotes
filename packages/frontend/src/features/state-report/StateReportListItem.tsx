import { Box, Popover, Typography } from "@mui/material";
import { ReportWithUser, StateReportWithUser } from "../report/ReportList";
import { fr } from "@codegouvfr/react-dsfr";
import { useState, useRef } from "react";
import { useStyles } from "tss-react";
import { uppercaseFirstLetterIf } from "../../utils";
import { Link } from "@tanstack/react-router";
import Button, { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { useClickAway } from "react-use";
import { ReportActions } from "../report/ReportActions";
import Badge from "@codegouvfr/react-dsfr/Badge";
import { Flex } from "#components/ui/Flex.tsx";
import { Divider } from "#components/ui/Divider.tsx";
import { StateReportActions } from "./StateReportActions";

export const StateReportListItem = ({
  report,
  isLast,
  onClick,
}: {
  report: StateReportWithUser;
  isLast?: boolean;
  onClick?: () => void;
}) => {
  const ref = useRef<HTMLButtonElement>(null);

  const { css } = useStyles();

  const title = report.titre_edifice;
  const whereText = report.commune ? `à ${report.commune}` : null;

  const isDraft = !report.attachment_id;

  return (
    <Flex className="report-list-item" position="relative" flexDirection="column" width="100%">
      <Link
        className={css({
          backgroundImage: "none",
          "&:active": {
            backgroundColor: "initial !important",
          },
        })}
        onClick={onClick}
        to={"/constat/$constatId"}
        params={{ constatId: report.id }}
        search={{ step: "constat-general" }}
      >
        <Box
          component="article"
          display="flex"
          flexDirection="column"
          mr="52px"
          color={fr.colors.decisions.text.actionHigh.blueFrance.default}
          fontSize="16px"
        >
          <Flex>
            <Typography textOverflow="ellipsis" fontWeight="bold" overflow="hidden" whiteSpace="nowrap">
              {title ?? "Sans titre"}
            </Typography>
          </Flex>
          <Box textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap" display="flex">
            <Typography mr="6px" component="span" fontWeight="bold">
              Constat d'état
            </Typography>
            commencé le
            {report.created_at ? (
              <Typography ml={"5px"}>{new Date(report.created_at).toLocaleDateString()}</Typography>
            ) : null}
          </Box>
          <Box textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
            {whereText}
          </Box>
          <Box mt="8px" mb={whereText ? "0" : "24px"}>
            <ReportBadge status={isDraft ? "draft" : "published"} />
          </Box>
        </Box>
      </Link>
      <Box position="absolute" top="10px" right="10px">
        <MenuPopoverTrigger report={report} />
      </Box>
      {isLast ? null : <Divider mt="16px" mb="8px" />}
    </Flex>
  );
};

const MenuPopoverTrigger = ({ report, ...props }: { report: StateReportWithUser; onClick?: () => void }) => {
  const { css } = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // const menuProps = {
  //   report,
  //   onClose: (e: Event) => {
  //     if (e.target !== ref.current) setIsOpen(false);
  //   },
  // };

  const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(e.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        className={css({
          borderRadius: "50%",
          width: "32px",
          minWidth: "32px",
          maxWidth: "32px",
          height: "32px",
          minHeight: "32px",
          maxHeight: "32px",
          backgroundColor: "#ECECFE",
          boxShadow: "none",
        })}
        aria-describedby={report.id}
        onClick={onClick}
        iconId="ri-more-fill"
        title="Actions"
        size="small"
        priority="secondary"
        type="button"
        {...props}
      />
      <Popover
        id={report.id}
        open={Boolean(anchorEl)}
        sx={{
          display: { xs: "none", lg: "block" },
        }}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <StateReportActions report={report} />
      </Popover>
      {anchorEl ? <MenuMobileModalContent onClose={onClose} report={report} /> : null}
    </>
  );
};

const MenuMobileModalContent = ({ onClose, report }: MenuProps) => {
  const isDesktop = useIsDesktop();
  const ref = useRef<HTMLDivElement>(null);

  useClickAway(ref, (e) => !isDesktop && onClose(e));

  return (
    <Box
      bgcolor="rgba(0,0,0,.8)"
      display={{ xs: "block", lg: "none" }}
      zIndex="modal"
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
    >
      <Box ref={ref} bgcolor="white" position="absolute" left="0" right="0" bottom="0">
        <StateReportActions report={report} />
      </Box>
    </Box>
  );
};

type MenuProps = { onClose: (e: Event) => void; report: StateReportWithUser };

type ReportStatus = "draft" | "published";
const ReportBadge = ({ status }: { status: ReportStatus }) => {
  return (
    <Badge
      severity={status === "draft" ? "info" : "success"}
      noIcon
      small
      style={{
        backgroundColor: colors[status][1],
        color: colors[status][0],
      }}
    >
      <Typography
        className={icons[status]}
        sx={{
          "::before": {
            width: "12px !important",
            height: "12px !important",
            verticalAlign: "middle !important",
            mb: "4px",
          },
        }}
      />
      <Typography ml="4px" fontSize="12px" fontWeight="bold">
        {status === "draft" ? "Brouillon" : "Envoyé"}
      </Typography>
    </Badge>
  );
};

const icons: Record<ReportStatus, string> = {
  draft: "ri-timer-fill",
  published: "ri-send-plane-fill",
};

const colors: Record<ReportStatus, [string, string]> = {
  draft: ["#716043", "#FEECC2"] as const,
  published: ["#18753C", "#D1F1D9"] as const,
};
