import { relations } from "drizzle-orm/relations";
import {
  service,
  user,
  internalUser,
  delegation,
  report,
  tmpPictures,
  sentEmail,
  stateReport,
  userDept,
  visitedSection,
} from "./schema";

export const userRelations = relations(user, ({ one, many }) => ({
  service: one(service, {
    fields: [user.serviceId],
    references: [service.id],
  }),
  internalUsers: many(internalUser),
  delegations_createdBy: many(delegation, {
    relationName: "delegation_createdBy_user_id",
  }),
  delegations_delegatedTo: many(delegation, {
    relationName: "delegation_delegatedTo_user_id",
  }),
  reports: many(report),
  stateReports: many(stateReport),
  userDepts: many(userDept),
}));

export const serviceRelations = relations(service, ({ many }) => ({
  users: many(user),
}));

export const internalUserRelations = relations(internalUser, ({ one }) => ({
  user: one(user, {
    fields: [internalUser.userId],
    references: [user.id],
  }),
}));

export const delegationRelations = relations(delegation, ({ one }) => ({
  user_createdBy: one(user, {
    fields: [delegation.createdBy],
    references: [user.id],
    relationName: "delegation_createdBy_user_id",
  }),
  user_delegatedTo: one(user, {
    fields: [delegation.delegatedTo],
    references: [user.id],
    relationName: "delegation_delegatedTo_user_id",
  }),
}));

export const reportRelations = relations(report, ({ one, many }) => ({
  user: one(user, {
    fields: [report.createdBy],
    references: [user.id],
  }),
  tmpPictures: many(tmpPictures),
  sentEmails: many(sentEmail),
}));

export const tmpPicturesRelations = relations(tmpPictures, ({ one }) => ({
  report: one(report, {
    fields: [tmpPictures.reportId],
    references: [report.id],
  }),
}));

export const sentEmailRelations = relations(sentEmail, ({ one }) => ({
  report: one(report, {
    fields: [sentEmail.reportId],
    references: [report.id],
  }),
}));

export const stateReportRelations = relations(stateReport, ({ one, many }) => ({
  user: one(user, {
    fields: [stateReport.createdBy],
    references: [user.id],
  }),
  visitedSections: many(visitedSection),
}));

export const userDeptRelations = relations(userDept, ({ one }) => ({
  user: one(user, {
    fields: [userDept.userId],
    references: [user.id],
  }),
}));
