EVENT_VISIBILITY = (
    ("PUBLIC", "Public"),
    ("PRIVATE", "Private"),
)

STIPE_PAYMENT_STATUSES = (
    ("PENDING", "Pending"),  # checkout session created
    ("PROCESSING", "Processing"),  # stripe has already called back
    ("CANCELLED", "Cancelled"),  # stripe has called back with a cancel
    (
        "SUCCESS",
        "Succeeded",
    ),  # stripe's async aknowledgement of the payment with success
    ("FAILURE", "Failed"),  # stripe's async aknowledgement of the payment with error
)
