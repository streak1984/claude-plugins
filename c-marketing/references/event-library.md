# GA4 Event Tracking Library

Comprehensive reference for auditing GA4 event tracking completeness. Organized by category. Use to check whether key events are tracked and named consistently.

---

## Marketing Site Events

### Page Engagement
| Event | Parameters | When to Track |
|-------|-----------|---------------|
| `page_view` | `page_title`, `page_location`, `page_referrer` | Every page load (automatic in GA4) |
| `scroll` | `percent_scrolled` | 25%, 50%, 75%, 90% thresholds |
| `click` | `link_url`, `link_text`, `outbound` | Outbound links, key internal links |
| `file_download` | `file_name`, `file_extension`, `link_url` | PDF, whitepaper, resource downloads |
| `video_start` | `video_title`, `video_provider`, `video_url` | Embedded video plays |
| `video_progress` | `video_title`, `video_percent` | 25%, 50%, 75% video completion |
| `video_complete` | `video_title`, `video_provider` | Video watched to end |

### Lead Generation
| Event | Parameters | When to Track |
|-------|-----------|---------------|
| `generate_lead` | `currency`, `value`, `lead_source` | Form submission (contact, demo, quote) |
| `form_start` | `form_name`, `form_id` | First interaction with a form field |
| `form_submit` | `form_name`, `form_id`, `form_destination` | Successful form submission |
| `form_error` | `form_name`, `error_type` | Validation error on submit |
| `newsletter_signup` | `list_name`, `signup_location` | Email list subscription |
| `cta_click` | `cta_text`, `cta_location`, `cta_destination` | CTA button clicks |

### Content Engagement
| Event | Parameters | When to Track |
|-------|-----------|---------------|
| `search` | `search_term`, `search_results` | Site search usage |
| `share` | `method`, `content_type`, `item_id` | Social sharing actions |
| `content_view` | `content_type`, `content_id`, `content_title` | Blog post, case study, resource views |
| `tab_click` | `tab_name`, `section` | Tab or accordion interactions |
| `calculator_use` | `calculator_type`, `input_values`, `result` | ROI calculators, pricing tools |

---

## Product Events (SaaS / App)

### Authentication
| Event | Parameters | When to Track |
|-------|-----------|---------------|
| `sign_up` | `method` | Account creation |
| `login` | `method` | User login |
| `logout` | — | User logout |
| `password_reset` | `method` | Password reset initiated |

### Onboarding
| Event | Parameters | When to Track |
|-------|-----------|---------------|
| `tutorial_begin` | `tutorial_name` | Onboarding flow started |
| `tutorial_complete` | `tutorial_name` | Onboarding flow completed |
| `onboarding_step` | `step_name`, `step_number`, `total_steps` | Each onboarding step |
| `feature_discovery` | `feature_name` | First use of a key feature |
| `activation` | `activation_criteria` | User reaches "aha moment" milestone |

### Core Product Usage
| Event | Parameters | When to Track |
|-------|-----------|---------------|
| `feature_use` | `feature_name`, `action` | Key feature interactions |
| `create_item` | `item_type` | User creates content/data |
| `edit_item` | `item_type`, `item_id` | User edits existing content |
| `delete_item` | `item_type`, `item_id` | User deletes content |
| `export_data` | `export_format`, `data_type` | Data export actions |
| `import_data` | `import_source`, `data_type` | Data import actions |
| `invite_user` | `role` | Team member invitation |
| `integration_connect` | `integration_name` | Third-party integration setup |

### Errors & Support
| Event | Parameters | When to Track |
|-------|-----------|---------------|
| `error` | `error_code`, `error_message`, `page` | Application errors shown to user |
| `support_request` | `request_type`, `category` | Help/support ticket created |
| `feedback_submit` | `feedback_type`, `rating` | In-app feedback submission |
| `help_article_view` | `article_id`, `article_title` | Help center article views |

---

## Monetization Events

### Subscription & Billing
| Event | Parameters | When to Track |
|-------|-----------|---------------|
| `view_pricing` | `page_variant` | Pricing page view |
| `select_plan` | `plan_name`, `plan_price`, `billing_cycle` | Plan selection |
| `begin_checkout` | `currency`, `value`, `items` | Checkout initiation |
| `purchase` | `transaction_id`, `currency`, `value`, `items` | Successful purchase |
| `subscription_upgrade` | `from_plan`, `to_plan`, `value` | Plan upgrade |
| `subscription_downgrade` | `from_plan`, `to_plan` | Plan downgrade |
| `subscription_cancel` | `plan_name`, `cancel_reason` | Cancellation initiated |
| `subscription_renew` | `plan_name`, `value` | Subscription renewed |
| `trial_start` | `plan_name`, `trial_duration` | Free trial started |
| `trial_end` | `plan_name`, `converted` | Free trial ended (track if converted) |

### Revenue
| Event | Parameters | When to Track |
|-------|-----------|---------------|
| `add_to_cart` | `currency`, `value`, `items` | Item added to cart |
| `remove_from_cart` | `currency`, `value`, `items` | Item removed from cart |
| `view_item` | `currency`, `value`, `items` | Product/plan detail view |
| `add_payment_info` | `currency`, `value`, `payment_type` | Payment info entered |
| `refund` | `transaction_id`, `currency`, `value` | Refund processed |
| `coupon_apply` | `coupon_code`, `discount_value` | Coupon/promo code used |

---

## E-commerce Events

### Shopping Behavior
| Event | Parameters | When to Track |
|-------|-----------|---------------|
| `view_item_list` | `item_list_name`, `items` | Product listing/category view |
| `select_item` | `item_list_name`, `items` | Product click from listing |
| `view_item` | `currency`, `value`, `items` | Product detail page view |
| `add_to_wishlist` | `currency`, `value`, `items` | Wishlist addition |
| `view_cart` | `currency`, `value`, `items` | Cart page view |
| `begin_checkout` | `currency`, `value`, `items`, `coupon` | Checkout start |
| `add_shipping_info` | `currency`, `value`, `shipping_tier` | Shipping selection |
| `add_payment_info` | `currency`, `value`, `payment_type` | Payment step |
| `purchase` | `transaction_id`, `currency`, `value`, `tax`, `shipping`, `items` | Order completion |

### Post-Purchase
| Event | Parameters | When to Track |
|-------|-----------|---------------|
| `review_submit` | `item_id`, `rating`, `review_length` | Product review submitted |
| `return_request` | `transaction_id`, `item_id`, `reason` | Return initiated |
| `reorder` | `transaction_id`, `items` | Repeat purchase from order history |

---

## B2B / SaaS-Specific Events

### Sales Pipeline
| Event | Parameters | When to Track |
|-------|-----------|---------------|
| `demo_request` | `company_size`, `industry`, `source` | Demo/sales request |
| `demo_scheduled` | `demo_date`, `rep_assigned` | Demo booked in calendar |
| `demo_completed` | `demo_duration`, `outcome` | Demo held |
| `proposal_viewed` | `proposal_id`, `view_duration` | Proposal/quote viewed |
| `contract_signed` | `deal_value`, `plan_name` | Contract signed |

### Account Management
| Event | Parameters | When to Track |
|-------|-----------|---------------|
| `workspace_create` | `workspace_name` | New workspace/org created |
| `seat_add` | `role`, `total_seats` | Team seat added |
| `seat_remove` | `role`, `total_seats` | Team seat removed |
| `permission_change` | `user_role`, `new_role` | Role/permission updated |
| `billing_update` | `change_type` | Billing info changed |

---

## Audit Checklist

When auditing GA4 event tracking, check:

1. **Naming convention** — Are all events snake_case? Consistent prefix patterns?
2. **Parameter consistency** — Same event uses same parameter names across pages?
3. **Required parameters** — Are recommended GA4 parameters included (currency, value for monetization events)?
4. **Event volume** — Are events actually firing? Check real-time report for each.
5. **Duplicate events** — Same action tracked by multiple tags?
6. **Missing events** — Compare against this library for the relevant category.
7. **Custom dimensions** — Are important parameters registered as custom dimensions in GA4?
8. **Conversion marking** — Are key events marked as conversions in GA4?
9. **Debug mode** — Test with GA4 DebugView to verify parameter values.
10. **Data freshness** — Are events appearing in reports within expected timeframe?